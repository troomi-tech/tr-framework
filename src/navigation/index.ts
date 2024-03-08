/**
 * @module Navigation
 * BrowserNavigation
 * NavigateOptions
 * Router
 */

export { default as BrowserNavigation } from './BrowserNavigation';
export type { NavigationHistoryState } from './BrowserNavigation';

export type { default as NavigateOptions } from './NavigationOptions';

export { default as TrRouter } from './Router';
export type { TrRoute, TrRouteGuard, TrRouterConfig, TrUrlParamLookup, TrRouteWithPermissions } from './Router';
