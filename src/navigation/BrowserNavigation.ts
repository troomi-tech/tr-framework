import NavigateOptions from './NavigationOptions';

type NavigationCallback = (newState: NavigationHistoryState, prevState: NavigationHistoryState) => void;

// Contains all the state information for when a page navigated
export interface NavigationHistoryState {
	path: string;
	viewName: string;
	routeOptions?: NavigateOptions;
}

// Contains the state data and extra info needed by the browser
interface NavigationHistoryExtra {
	key: number;
	isBacked: boolean;
	state: NavigationHistoryState;
}

class BrowserNavigation {
	private lastHistoryTime: number = 0;
	private historyData: NavigationHistoryExtra[] = [];
	private backCallbacks: NavigationCallback[] = [];
	private forwardCallbacks: NavigationCallback[] = [];

	private uncommittedState: NavigationHistoryExtra | undefined = undefined;
	private prevHistoryState: NavigationHistoryExtra | undefined = undefined;

	constructor() {
		this.onPopStateWithTest = this.onPopStateWithTest.bind(this);
		this.onPopStateAllow = this.onPopStateAllow.bind(this);
		window.onpopstate = this.onPopStateWithTest;

		(window as any).browserNavigation = this;
	}

	getLastHistoryTime() {
		return this.lastHistoryTime;
	}

	replaceState(state: NavigationHistoryState) {
		let endState: NavigationHistoryExtra;
		if (this.historyData.length > 0) {
			endState = { ...this.historyData[this.historyData.length - 1] };
			endState.state = state;
			this.historyData[this.historyData.length - 1] = endState;
		} else {
			endState = {
				key: Date.now(),
				isBacked: false,
				state
			};
			this.historyData.push(endState);
		}

		window.history.replaceState(this.createBrowserState(endState.key), '', state.path);
		this.printAllViewHistory();
	}

	pushHistory(state: NavigationHistoryState) {
		this.deleteAllBackedStates();

		let history: NavigationHistoryExtra = {
			key: Date.now(),
			state,
			isBacked: false
		};

		this.historyData.push(history);
		this.lastHistoryTime = history.key;
		window.history.pushState(this.createBrowserState(history.key), '', state.path);

		this.printAllViewHistory();
	}

	back(): boolean {
		if (this.historyData.length < 2) return false;
		window.history.back();
		return true;
	}

	forward() {
		window.history.forward();
	}

	onBackPressed(callback: NavigationCallback) {
		this.backCallbacks.push(callback);
	}

	onForwardPressed(callback: NavigationCallback) {
		this.forwardCallbacks.push(callback);
	}

	sleep(countMs: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, countMs);
		});
	}

	async commitState() {
		if (!this.uncommittedState) return;
		window.onpopstate = this.onPopStateAllow;
		window.history.back();
		// sleep so that the pop state can fire
		await this.sleep(10);
		this.uncommittedState = undefined;
	}

	async uncommitState() {
		if (!this.uncommittedState) return;
		window.history.pushState(
			this.createBrowserState(this.uncommittedState.key),
			'',
			this.uncommittedState.state.path
		);
		this.lastHistoryTime = this.uncommittedState.key;
		window.onpopstate = this.onPopStateAllow;
		window.history.back();
		// sleep so that the pop state can fire
		await this.sleep(10);
		this.uncommittedState = undefined;
	}

	private onPopStateAllow(e: PopStateEvent) {
		if (!e.state) {
			console.error("Received a browser action but we don't have any state to navigate to.");
			return;
		}

		if (Object.prototype.hasOwnProperty.call(window, 'showBrowseLogs')) console.log('POP STATE (ALLOW): ', e.state);

		let { key } = e.state;

		let viewHistoryState = this.getMatchingViewHistoryState(key);
		if (!viewHistoryState) {
			console.error("We don't have a matching history state for browser event!!!");
			return;
		}

		if (this.lastHistoryTime < key) {
			// Forward Button Navigate
			this.clearHistoryStateBacked(key);
			this.lastHistoryTime = key;
		} else {
			// Back Button Navigate
			this.setHistoryStateBacked(this.lastHistoryTime);
			this.lastHistoryTime = key;
		}

		this.printAllViewHistory();
		window.onpopstate = this.onPopStateWithTest;
	}

	private onPopStateWithTest(e: PopStateEvent) {
		if (!e.state) {
			console.error("Received a browser action but we don't have any state to navigate to.");
			return;
		}

		if (Object.prototype.hasOwnProperty.call(window, 'showBrowseLogs')) console.log('POP STATE (TEST): ', e.state);

		let { key } = e.state;

		let viewHistoryState = this.getMatchingViewHistoryState(key);
		if (!viewHistoryState) {
			console.error("We don't have a matching history state for browser event!!!");
			return;
		}
		this.uncommittedState = viewHistoryState;

		// Here we quickly reset the state to its previous self until it is committed by the router. This allows
		// us to reject the back or forward navigation
		this.prevHistoryState = this.getMatchingViewHistoryState(this.lastHistoryTime);
		if (!this.prevHistoryState) {
			console.error("We don't have a matching current history state for browser event!!!");
			return;
		}
		// TODO: Figure out why RedSky put this line in, since it breaks backward navigation
		// window.history.pushState(
		// 	this.createBrowserState(this.prevHistoryState.key),
		// 	'',
		// 	this.prevHistoryState.state.path
		// );

		this.printAllViewHistory();

		if (this.lastHistoryTime < key) {
			// Forward Button Navigate
			this.fireForwardEvent(viewHistoryState, this.prevHistoryState);
		} else {
			// Back Button Navigate
			this.fireBackEvent(viewHistoryState, this.prevHistoryState);
		}
	}

	getMatchingViewHistoryState(key: number): NavigationHistoryExtra | undefined {
		return this.historyData.find((item) => {
			return item.key === key;
		});
	}

	setHistoryStateBacked(key: number) {
		let history = this.getMatchingViewHistoryState(key);
		if (!history) {
			console.error('Could not find history matching key: ', key);
			return;
		}
		history.isBacked = true;
	}

	clearHistoryStateBacked(key: number) {
		let history = this.getMatchingViewHistoryState(key);
		if (!history) {
			console.error('Could not find history matching key: ', key);
			return;
		}
		history.isBacked = false;
	}

	fireBackEvent(newHistory: NavigationHistoryExtra, prevHistory: NavigationHistoryExtra) {
		if (Object.prototype.hasOwnProperty.call(window, 'showBrowseLogs')) console.log('Browser back clicked');
		for (let i in this.backCallbacks) {
			this.backCallbacks[i](newHistory.state, prevHistory.state);
		}
	}

	fireForwardEvent(newHistory: NavigationHistoryExtra, prevHistory: NavigationHistoryExtra) {
		if (Object.prototype.hasOwnProperty.call(window, 'showBrowseLogs')) console.log('Browser forward clicked');
		for (let i in this.forwardCallbacks) {
			this.forwardCallbacks[i](newHistory.state, prevHistory.state);
		}
	}

	createBrowserState(key: number) {
		return { key };
	}

	deleteAllBackedStates() {
		this.historyData = this.historyData.filter((data: any) => {
			return !data.isBacked;
		});
	}

	printAllViewHistory() {
		if (!Object.prototype.hasOwnProperty.call(window, 'showBrowseLogs')) return;
		let historyLog: any = {};

		let count = 1;
		for (let history of this.historyData) {
			let prefix = '';
			if (history.key === this.lastHistoryTime) prefix = '♣';
			if (history.isBacked) prefix += 'BACK';
			historyLog[`history: ${count++}`] = {
				key: history.key,
				path: prefix + history.state.path,
				viewName: history.state.viewName,
				options: history.state.routeOptions ? JSON.stringify(history.state.routeOptions) : ''
			};
		}

		console.table(historyLog);
	}
}

export default BrowserNavigation;
