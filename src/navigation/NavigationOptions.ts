export default interface NavigateOptions {
	view?: string | string[]; // The view in which to load the new page into. This would override the routes definition. If no view is specified in either then it loads in current view
	reloadCurrent?: boolean; // (not finished) replace the current page with the new one from route, no animation in this case
	reloadPrevious?: boolean; // (not finished) replace the previous page in history with the new one from route
	reloadAll?: boolean; // (not finished) load new page and remove all previous pages from history and DOM
	clearPreviousHistory?: boolean; // (not finished) previous pages history will be cleared after reloading/navigate to the specified route
	animate?: boolean; // (not finished) whether the page should be animated or not (default based on router config)
	history?: boolean; // (not finished) whether the page should be saved in router history
	transition?: string; // (not finished) route custom page transition name (flip, parallax, etc)
}
