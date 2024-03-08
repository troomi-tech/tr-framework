import { ReactPage, View } from '../components';
import { DomUtils, ObjectUtils } from '../utils';
import TrNavigationEvents from '../utils/events';
import BrowserNavigation, { NavigationHistoryState } from './BrowserNavigation';
import NavigateOptions from './NavigationOptions';

type ActiveViewChangedCallback = (newView: string, previousView: string | null, metaData?: any) => void;
type RouterNavigateCallback = (newPath: string, previousPath: string | null) => void;
type RouterBeforeNavigateCallback = (
	newPath: string,
	previousPath: string | null,
	newFullPath: string
) => void | Promise<boolean>;

export type TrRouteGuard = (path: string) => false | string;

export interface TrUrlParamLookup {
	key: string;
	default: number | string;
	type: 'integer' | 'float' | 'string';
	alias?: string;
}

export interface TrRoute {
	/** The path to be used when loading the page component, '*' is any path */
	path: string;
	/** The page component to be loaded when the path is matched */
	page: ReactPage;
	/**
	 * The route guard to be used when loading the page component. If the route guard returns false then the user
	 * will be redirected to the default page. If the route guard returns a string then the user will be redirected
	 * to the string path.
	 */
	TrrouteGuard?: TrRouteGuard;
	/** The options for the route. Most common will be view to default load page into */
	options?: NavigateOptions;
}

interface TrRouteWithPathParams extends TrRoute {
	/** The path parameters to be used when loading the page component */
	pathParams?: { [key: string]: string };
}

export interface TrRouteWithPermissions<T = string> extends TrRouteWithPathParams {
	/** The permissions required to view the page */
	permissions?: T[];
}

/**
 *  Router configs control how the router operates. Some of these values are used when no RouteDetails are specified and
 * the navigate/back functions are called without options. The order of precedence is:
 * HIGHEST -> Navigate/Back Options -> Route Options -> Router Options -> LOWEST
 */
export interface TrRouterConfig {
	/**  specifies if the router should animate when navigating to a new page  @default true */
	animate: boolean;
	/** specifies if the router should allow swipe back to previous page @default true */
	allowSwipeBack: boolean;
}

/**
 * @abstract
 * Router class that handles navigation between pages
 * @class
 * @example
 *
 * let globalRouter = new Router();
 * export default globalRouter;
 *
 * class Router extends TrRouter {
 *   constructor() {
 *     super();
 *
 * 	   globalRouter = this; // This is required for the getInstance() method to work
 *
 *     this.loadStaticRoutes([
 *       {
 *         path: "/",
 *         page: HomePage,
 *         options: { view: "home" },
 *       },
 *       {
 *         path: "/login",
 *         page: LoginPage,
 *         options: { view: "login" },
 *       },
 *       {
 *         path: "/admin",
 *         page: AdminPage,
 *         options: { view: "admin" },
 *         permissions: ["your-admin-role-here"],
 *       },
 *       {
 *         path: "*",
 *         page: NotFoundPage,
 *         options: { view: "not-found" },
 *       },
 *     ]);
 *
 *   getUserRole() {
 *     // your logic here to get the current user role
 *     return "your-user-role-here";
 *   }
 * }
 * @property {string} currentViewName - The current view name
 * @property {string} lastKnownViewName - The last known view name
 * @property {boolean} goingBack - If we are currently going back
 * @property {boolean} navigating - If we are currently navigating
 * @property {TrRouterConfig} routerConfig - The router config
 * @property {TrRoute | undefined} notFoundRoute - The not found route
 * @property {TrRoute[]} routes - The routes
 * @property {string[]} viewHistory - The view history
 * @property {string} initialStartPathQuery - The initial start path query
 * @property {boolean} initialPathLoadAttempted - If the initial path load has been attempted
 * @property {BrowserNavigation} browserNavigation - The browser navigation
 */
abstract class TrRouter {
	private views: { [key: string]: View } = {};
	private routes: TrRouteWithPermissions[] = [];
	private notFoundRoute: TrRoute | undefined;
	private viewHistory: string[] = [];
	private navigating = false;
	private readonly routerConfig: TrRouterConfig = {
		animate: true,
		allowSwipeBack: true
	};

	private pendingNavigation: { path: string; options?: NavigateOptions; forwardBrowserEvent?: boolean }[] = [];
	private pendingBack: { state: NavigationHistoryState }[] = [];
	private currentViewName: string = '';
	private lastKnownViewName: string | null = null;
	private goingBack: boolean = false;

	private activeViewChangedCallbackList: { id: number; callback: ActiveViewChangedCallback }[] = [];
	private beforeNavigateCallbackList: { id: number; callback: RouterBeforeNavigateCallback }[] = [];
	private afterNavigateCallbackList: { id: number; callback: RouterNavigateCallback }[] = [];

	private readonly initialStartPathQuery: string;
	private initialPathLoadAttempted: boolean = false;

	private browserNavigation: BrowserNavigation;

	constructor(routerConfig?: Partial<TrRouterConfig>) {
		if (routerConfig) this.routerConfig = { ...this.routerConfig, ...routerConfig };

		this.browserNavigation = new BrowserNavigation();

		this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
		this.onForwardButtonPressed = this.onForwardButtonPressed.bind(this);
		this.onCheckNavigation = this.onCheckNavigation.bind(this);
		this.browserNavigation.onBackPressed(this.onBackButtonPressed);
		this.browserNavigation.onForwardPressed(this.onForwardButtonPressed);

		// Determine if we are loading an alternative initialPath
		let path = window.location.pathname;
		path = path.replace(/^(.+?)\/*?$/, '$1'); // Remove trailing slash
		path += window.location.search;
		this.initialStartPathQuery = path;

		TrNavigationEvents.on('routerBack', () => {
			this.back();
		});

		TrNavigationEvents.on('addView', (data: { id: string; instance: View; default: boolean }) => {
			if (this.currentViewName && !this.currentViewName.toLowerCase().includes('popup')) {
				this.lastKnownViewName = this.currentViewName;
				this.viewHistory.push(this.currentViewName);
			}

			this.addView(data.id, data.instance);

			let routeDetails = this.getRouteDetailsForPath(data.instance.getPath());

			if (!routeDetails) {
				console.error(
					'view just added has an initial path that does not exist in routes!!!',
					data.instance.getPath()
				);
				return;
			}

			if (routeDetails.TrrouteGuard) {
				let result = routeDetails.TrrouteGuard(routeDetails.path);

				if (typeof result === 'boolean') {
					if (!result) {
						console.error('view just added route guard did not give alternate path!!!');
						return;
					} else {
						data.instance.setPage(routeDetails.page, data.instance.getPath());
					}
				} else if (typeof result === 'string') {
					let newRouteDetails = this.getRouteDetailsForPath(result);
					if (!newRouteDetails) {
						console.error('view just added has an initial path that does not exist in routes!!!', result);
						return;
					}

					data.instance.setPage(newRouteDetails.page, result);
				}
			} else {
				data.instance.setPage(routeDetails.page, data.instance.getPath());
			}

			if (data.default) {
				this.setActiveView(data.id);
				this.browserNavigation.replaceState({ path: data.instance.getPath(), viewName: data.id });
			}
		});

		TrNavigationEvents.on('removeView', (data: { id: string }) => {
			this.removeView(data.id);
		});

		TrNavigationEvents.on('activeViewChange', async (viewName: string) => {
			if (this.currentViewName === viewName) {
				await this.forceHome(viewName);
				return;
			}

			if (!Object.prototype.hasOwnProperty.call(this.views, viewName)) return;

			const previousPathNoQuery = this.views[this.currentViewName].getPath().split('?')[0];
			const newPathNoQuery = this.views[viewName].getPath().split('?')[0];

			this.fireBeforeRouterNavigateCallbacks(newPathNoQuery, previousPathNoQuery, this.views[viewName].getPath());

			this.setActiveView(viewName);

			let currentView = this.views[this.currentViewName];
			this.browserNavigation.pushHistory({
				viewName: this.currentViewName,
				path: currentView.getPath()
			});

			this.fireAfterRouterNavigateCallbacks(newPathNoQuery, previousPathNoQuery);
		});
	}

	/**
	 * @abstract
	 * use this for permission based routing
	 * This method is protected and should be called internally
	 * @param {args} args Extra arguments if needed
	 * @returns {string | undefined} The user role
	 * @example
	 * getUserRole() {
	 *  // your logic here to get the current user role
	 * 	return "your-user-role-here";
	 * }
	 */
	protected abstract getUserRole(): string | undefined;

	/**
	 * Returns the current active name
	 * @returns {string | null} The current view name
	 */
	getActiveViewName(): string | null {
		return this.currentViewName;
	}

	/**
	 * Checks roles authorization depending on the permissions required for a route
	 * @returns {boolean} determined if user is allowed to view/interact with page
	 */
	isAuthorizedToViewPage(path: string): boolean {
		const details = this.getRouteDetailsForPath(path);
		if (!ObjectUtils.isArrayWithData(details?.permissions)) return true;

		const userRole = this.getUserRole();
		if (!userRole) return false;

		return details?.permissions?.includes(userRole) ?? false;
	}

	/**
	 * Returns the current path loaded by the browser
	 * @returns {string} The current path, does not include query or hash
	 */
	getCurrentPath(): string {
		return window.location.pathname;
	}

	/**
	 * Dyanmically adds a route
	 * @param route
	 */
	addRoute(route: TrRoute) {
		this.routes.push(route);
	}

	/**
	 * Adds routes to the known static routes for the application. Must be called before any views are rendered.
	 * @param {RouteDetails[]} initialRoutes - The static routes used on start
	 */
	loadStaticRoutes(initialRoutes: TrRoute[]) {
		this.routes = initialRoutes;
		this.notFoundRoute = this.routes.find((route) => {
			return route.path === '*';
		});
	}

	/**
	 * Attempts to load the initial path with the possibility of getting a 404 page. This is usually called when
	 * the main app determines if the user is logged in or not
	 */
	tryToLoadInitialPath() {
		if (this.initialStartPathQuery === '/' || this.initialPathLoadAttempted) return;

		this.initialPathLoadAttempted = true;
		let initialPathNoQuery = this.initialStartPathQuery.split('?')[0];
		let initialPathRouteDetails = this.getRouteDetailsForPath(initialPathNoQuery);
		if (!initialPathRouteDetails) {
			if (this.notFoundRoute) {
				// Find the default view
				for (let viewName in this.views) {
					if (this.views[viewName].isDefault()) {
						this.setActiveView(viewName);
						this.views[viewName].setPage(this.notFoundRoute.page, this.initialStartPathQuery);
						this.browserNavigation.replaceState({
							path: this.initialStartPathQuery,
							viewName
						});
						return;
					}
				}
			}
			console.error("Invalid route given and we don't have a valid 404 page.");
			return;
		}

		if (!this.checkTrRouteGuard(initialPathRouteDetails)) return;

		const pathNoQuery = this.initialStartPathQuery.split('?')[0];
		this.fireBeforeRouterNavigateCallbacks(pathNoQuery, '/', this.initialStartPathQuery);

		if (initialPathRouteDetails?.options?.view) {
			if (!this.setActiveView(initialPathRouteDetails.options.view)) return;
		}

		this.browserNavigation.replaceState({
			path: this.initialStartPathQuery,
			viewName: this.currentViewName
		});

		this.views[this.currentViewName].setPage(initialPathRouteDetails.page, this.initialStartPathQuery);
		this.fireAfterRouterNavigateCallbacks(pathNoQuery, '/');
	}

	/**
	 * Add callback and subscribe to active view changed event
	 * @param {ActiveViewChangedCallback} callback
	 * @returns {number}
	 */
	subscribeToActiveViewChanged(callback: ActiveViewChangedCallback): number {
		const id = Date.now();
		this.activeViewChangedCallbackList.push({ id, callback });
		return id;
	}

	/**
	 * Remove subscribed callback of active view changed event
	 * @param id
	 */
	unsubscribeFromActiveViewChanged(id: number) {
		this.activeViewChangedCallbackList = this.activeViewChangedCallbackList.filter((callbackHandler) => {
			return callbackHandler.id !== id;
		});
	}

	/**
	 * Add callback and subscribe to the before router navigation events
	 * @param {RouterNavigateCallback} callback
	 * @returns {number}
	 */
	subscribeToBeforeRouterNavigate(callback: RouterBeforeNavigateCallback): number {
		const id = Date.now();
		this.beforeNavigateCallbackList.push({ id, callback });
		return id;
	}

	/**
	 * Remove subscribed callback of before router navigation events
	 * @param id
	 */
	unsubscribeFromBeforeRouterNavigate(id: number) {
		this.beforeNavigateCallbackList = this.beforeNavigateCallbackList.filter((callbackHandler) => {
			return callbackHandler.id !== id;
		});
	}

	/**
	 * Add callback and subscribe to the after router navigation events
	 * @param {RouterNavigateCallback} callback
	 * @returns {number}
	 */
	subscribeToAfterRouterNavigate(callback: RouterNavigateCallback): number {
		const id = Date.now();
		this.afterNavigateCallbackList.push({ id, callback });
		return id;
	}

	/**
	 * Remove subscribed callback of after router navigation events
	 * @param id
	 */
	unsubscribeFromAfterRouterNavigate(id: number) {
		this.afterNavigateCallbackList = this.afterNavigateCallbackList.filter((callbackHandler) => {
			return callbackHandler.id !== id;
		});
	}

	/**
	 * Check if route path exists
	 * @param {string} routePath
	 * @returns {boolean}
	 */
	hasRoute(routePath: string): boolean {
		return this.routes.some((route) => {
			return route.path === routePath;
		});
	}

	/**
	 * Go back. Eventually should be smarter to say back in a certain view
	 */
	back(fallbackPath?: string) {
		if (!this.browserNavigation.back() && fallbackPath) {
			this.navigate(fallbackPath).catch(console.error);
		}
	}

	/**
	 * Force current view to initialPath specified when view was added
	 * @param viewName - Name of the view to load, the id given
	 */
	forceHome(viewName: string) {
		this.setActiveView(viewName);
		let path = this.views[this.currentViewName as string].getInitialPath();
		return this.navigate(path, {});
	}

	/**
	 * Navigate to input path
	 * @param path
	 * @param {NavigateOptions} options
	 * @param forwardBrowserEvent - Set if navigate was result of a forward button event
	 */
	async navigate(path: string, options?: NavigateOptions, forwardBrowserEvent?: boolean) {
		if (!(await this.loadUrlCheck(path))) return;
		if (!this.isAuthorizedToViewPage(path)) return;

		await this.navigateAllow(path, options, forwardBrowserEvent);
	}

	/**
	 * Retrieves from the current URL the parameters
	 * @param {TrUrlParamLookup} params - The params in which to get. Includes defaults
	 * @returns TrUrlParamLookup[]
	 */
	getPageUrlParams<T>(params: TrUrlParamLookup[]): T {
		const urlParams = new URLSearchParams(window.location.search);
		const result: { [key: string]: string | number } = {};
		for (const param of params) {
			if (urlParams.has(param.key)) {
				const paramValue = urlParams.get(param.key) as string;
				if (param.type === 'integer') result[param?.alias || param.key] = parseInt(paramValue);
				else if (param.type === 'float') result[param?.alias || param.key] = parseFloat(paramValue);
				else result[param?.alias || param.key] = paramValue;
			} else {
				result[param?.alias || param.key] = param.default;
			}
		}
		return result as T;
	}

	/**
	 * Retrieves from the current URL the parameters
	 * @param {TrUrlParamLookup} params - The params in which to get. Includes defaults
	 * @returns TrUrlParamLookup[]
	 */
	getPagePathParams<T>(params: TrUrlParamLookup[]): T {
		const routeDetails = this.getRouteDetailsForPath(window.location.pathname);
		const result: { [key: string]: string | number } = {};
		for (const param of params) {
			if (routeDetails?.pathParams && Object.prototype.hasOwnProperty.call(routeDetails.pathParams, param.key)) {
				const paramValue = routeDetails.pathParams[param.key];
				if (param.type === 'integer') result[param?.alias || param.key] = parseInt(paramValue);
				else if (param.type === 'float') result[param?.alias || param.key] = parseFloat(paramValue);
				else result[param?.alias || param.key] = paramValue;
			} else {
				result[param?.alias || param.key] = param.default;
			}
		}

		return result as T;
	}

	/**
	 * Updates the current page's URL parameters. This should only be called by the page that is loaded.
	 * @param params - object containing parameters to be set in the url.
	 */
	updateUrlParams(params: { [key: string]: number | string }) {
		let paramString = '';
		if (!this.currentViewName) return;
		for (const param in params) {
			let paramValue: string = params[param].toString();
			if (!paramString) paramString = `?${param}=${paramValue}`;
			else paramString += `&${param}=${paramValue}`;
		}
		const url = this.views[this.currentViewName].getPath().split('?')[0] + paramString;
		this.browserNavigation.replaceState({
			path: url,
			viewName: this.currentViewName
		});
	}

	/**
	 * Performs the actual navigate to a page. Must be proceeded by a loadUrlCheck()
	 * @param path
	 * @param options
	 * @param forwardBrowserEvent
	 * @private
	 */
	private async navigateAllow(path: string, options?: NavigateOptions, forwardBrowserEvent?: boolean) {
		if (this.navigating) return this.navigateLater(path, options, forwardBrowserEvent);
		this.navigating = true;

		const url = new URL(path, 'https://unknown.com');
		const pathNoQueryNoHash = url.pathname;

		let routeDetails = this.getRouteDetailsForPath(path) || this.notFoundRoute;
		if (!routeDetails) return;

		let requestedView = options?.view || routeDetails.options?.view;
		if (requestedView && requestedView !== this.currentViewName) {
			this.setActiveView(requestedView);
		}
		let currentView = this.calculateCurrentView(options?.view);
		if (!this.views[currentView]) {
			this.navigating = false;
			this.navigateFinished();
			console.error('this view does not exist.', currentView);
			return;
		}

		if (!forwardBrowserEvent)
			this.browserNavigation.pushHistory({ path, viewName: currentView, routeOptions: options });
		await this.views[currentView].setPage(routeDetails.page, path);

		// To get the browser to page down to the location we need to use window.location.replace
		// However this is great for navigating forward, more code needs to be written for backwards
		// and forwards navigations whenever we have a hash. commenting out until I have time to
		// do it right.
		// if (url.hash) window.location.replace(path);

		this.fireAfterRouterNavigateCallbacks(pathNoQueryNoHash, this.getCurrentPath());

		this.navigating = false;
		this.navigateFinished();
	}

	/**
	 * Checks route guards and before navigation checks
	 * @param path
	 * @param options
	 * @private
	 */
	private async loadUrlCheck(path: string): Promise<boolean> {
		const url = new URL(path, 'https://unknown.com');
		const pathNoQueryNoHash = url.pathname;

		let routeDetails = this.getRouteDetailsForPath(path) || this.notFoundRoute;
		if (!routeDetails) {
			console.error('this path does not exist.', path);
			return false;
		}

		if (!this.checkTrRouteGuard(routeDetails)) {
			return false;
		}

		let prevent = await this.fireBeforeRouterNavigateCallbacks(pathNoQueryNoHash, this.getCurrentPath(), path);
		return !prevent;
	}

	private checkTrRouteGuard(routeDetails: TrRoute): boolean {
		if (!routeDetails.TrrouteGuard) return true;

		let result = routeDetails.TrrouteGuard(routeDetails.path);
		if (typeof result === 'string') {
			this.navigate(result);
			return false;
		}

		if (!result) {
			this.navigate('/');
			return false;
		}

		return true;
	}

	/**
	 * Calls all registered callbacks
	 * @param {string} newPath
	 * @param {string} previousPath
	 * @param newFullPath
	 * @return Returns true if we should prevent navigating to the next route.
	 */
	private async fireBeforeRouterNavigateCallbacks(
		newPath: string,
		previousPath: string,
		newFullPath: string
	): Promise<boolean> {
		let prevent = false;
		for (let callback of this.beforeNavigateCallbackList) {
			let callbackPreventPromise = callback.callback(newPath, previousPath, newFullPath);
			if (callbackPreventPromise && (await callbackPreventPromise)) prevent = true;
		}
		return prevent;
	}

	/**
	 * Calls all registered callbacks
	 * @param {string} newPath
	 * @param {string} previousPath
	 */
	private fireAfterRouterNavigateCallbacks(newPath: string, previousPath: string) {
		for (let callback of this.afterNavigateCallbackList) {
			callback.callback(newPath, previousPath);
		}
	}

	private findFirstViewName(potentialViewNames: string | string[]): string | null {
		if (typeof potentialViewNames === 'string') {
			if (Object.prototype.hasOwnProperty.call(this.views, potentialViewNames)) return potentialViewNames;
		} else if (Array.isArray(potentialViewNames)) {
			for (let name of potentialViewNames) {
				if (Object.prototype.hasOwnProperty.call(this.views, name)) return name;
			}
		}
		return null;
	}

	/**
	 * Set active view to input view
	 * @param {string} viewName
	 * @param metaData
	 */
	private setActiveView(viewName: string | string[], metaData?: any): boolean {
		let foundViewName = this.findFirstViewName(viewName);
		if (!foundViewName) return false;

		const previousViewName = this.currentViewName;
		this.currentViewName = foundViewName;
		const viewElement = document.getElementById(foundViewName);
		if (!viewElement) return false;
		const allSiblingViews = DomUtils.childrenWithClass(viewElement.parentElement, 'rs-view');
		if (!allSiblingViews) return false;
		for (let i in allSiblingViews) {
			DomUtils.removeClass(allSiblingViews[i], 'active-view');
		}
		DomUtils.addClass(viewElement, 'active-view');
		const tabs = DomUtils.firstChildWithClass(viewElement.parentElement, 'rs-tabs') as HTMLElement;
		this.setActiveTabElement(tabs, foundViewName);

		for (let handler of this.activeViewChangedCallbackList) {
			handler.callback(foundViewName, previousViewName, metaData);
		}

		return true;
	}

	/**
	 * Calculates a current view with optional view name passed in. I think I want this method removed
	 * @param optionalViewName
	 */
	private calculateCurrentView(optionalViewName?: string | string[]) {
		return this.findFirstViewName(optionalViewName || '') || this.currentViewName || this.lastKnownViewName || '';
	}

	/**
	 * Called when the browser notifies us of a backwards navigation
	 * @param newState
	 * @private
	 */
	private async navigateBack(newState: NavigationHistoryState) {
		if (this.goingBack) return this.backLater(newState);
		this.goingBack = true;

		const pathNoQuery = newState.path.split('?')[0];

		let routeDetails = this.getRouteDetailsForPath(newState.path) as TrRoute;

		this.setActiveView(newState.viewName);
		await this.views[newState.viewName].back(routeDetails.page, newState.path);

		this.fireAfterRouterNavigateCallbacks(pathNoQuery, this.getCurrentPath());

		this.goingBack = false;
		this.backFinished().catch(console.error);
	}

	private setActiveTabElement(tabsElement: HTMLElement, view: string) {
		if (!tabsElement) return;
		const siblingTabs = DomUtils.childrenWithClass(tabsElement, 'rs-tab');
		for (let i in siblingTabs) {
			DomUtils.removeClass(siblingTabs[i], 'active-tab');
		}
		const activeTab = DomUtils.firstChildWithClass(tabsElement, 'view-name-' + view);
		DomUtils.addClass(activeTab, 'active-tab');
	}

	private getRouteDetailsForPath(path: string): TrRouteWithPermissions | undefined {
		let pathNoQueryNoHash = path.split('?')[0].split('#')[0];
		let viewNames = Object.keys(this.views);

		// Check for exact matches first
		let foundRoute = this.routes
			.filter((route) => route.path === pathNoQueryNoHash)
			.find((route) => {
				if (route.options?.view && !viewNames.includes(route.options.view as string)) return false;
				return !this.hasInsufficientPermissionsForRoute(route);
			});

		let pathParams: { [key: string]: string } = {};

		if (!foundRoute) {
			// Check for routes with path parameters
			foundRoute = this.routes.find((route) => {
				if (route.options?.view && !viewNames.includes(route.options?.view as string)) return false;
				if (this.hasInsufficientPermissionsForRoute(route)) return false;
				if (!route.path.includes(':')) return false;

				let routePathParts = route.path.split('/').filter(Boolean);
				let pathParts = pathNoQueryNoHash.split('/').filter(Boolean);
				if (routePathParts.length !== pathParts.length) return false;
				if (routePathParts.length === 0) return false;
				for (let i = 0; i < routePathParts.length; i++) {
					if (routePathParts[i].includes(':')) {
						pathParams[routePathParts[i]] = pathParts[i];
						continue;
					}
					if (routePathParts[i] !== pathParts[i]) return false;
				}
				return true;
			});
		}

		if (foundRoute) return { ...foundRoute, pathParams };
		return foundRoute;
	}

	private hasInsufficientPermissionsForRoute(route: TrRouteWithPermissions): boolean {
		const userRole = this.getUserRole();
		return !!userRole && !!route.permissions && !route.permissions.includes(userRole);
	}

	private async navigateFinished() {
		let toNavigate = this.pendingNavigation.pop();
		if (toNavigate) await this.navigateAllow(toNavigate.path, toNavigate.options, toNavigate.forwardBrowserEvent);
	}

	private navigateLater(path: string, options?: NavigateOptions, forwardBrowserEvent?: boolean) {
		this.pendingNavigation.push({ path, options, forwardBrowserEvent });
	}

	private async backFinished() {
		let toGoBack = this.pendingBack.pop();
		if (toGoBack) await this.navigateBack(toGoBack.state);
	}

	private backLater(state: NavigationHistoryState) {
		this.pendingBack.push({ state });
	}

	private addView(id: string, instance: View) {
		this.views[id] = instance;
		this.viewHistory.push(id);
	}

	private removeView = (id: string) => {
		delete this.views[id];
		this.viewHistory.pop();
		this.currentViewName = this.viewHistory[this.viewHistory.length - 1];
	};

	private async onBackButtonPressed(newState: NavigationHistoryState) {
		await this.navigateBack(newState);
	}

	private async onForwardButtonPressed(state: NavigationHistoryState) {
		await this.navigateAllow(state.path, state.routeOptions, true);
	}

	private async onCheckNavigation(state: NavigationHistoryState): Promise<boolean> {
		return this.loadUrlCheck(state.path);
	}
}

export default TrRouter;
