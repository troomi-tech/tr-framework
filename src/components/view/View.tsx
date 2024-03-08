import React, { Component, createRef } from 'react';
import './View.scss';
import events from '../../utils/events';

export interface ViewProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The id of the view. Required for navigation */
	id: string;
	/** The initial path of the view */
	initialPath: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether or not this view is the default view @default false */
	default?: boolean;
}

export type ReactPage = React.ComponentType;

interface ViewState {
	currentPage: ReactPage | null;
	transitionToPage: ReactPage | null;
	transitioning: boolean;
	navigatingBack: boolean;
	path: string;
}

export default class View extends Component<ViewProps, ViewState> {
	constructor(props: ViewProps) {
		super(props);
		this.state = {
			currentPage: null,
			transitionToPage: null,
			transitioning: false,
			navigatingBack: false,
			path: props.initialPath
		};
	}

	viewElement = createRef<HTMLDivElement>();

	componentDidMount() {
		events.dispatch('addView', { id: this.props.id, default: !!this.props.default, instance: this });
	}

	componentWillUnmount() {
		events.dispatch('removeView', { id: this.props.id });
	}

	getPath() {
		return this.state.path;
	}

	getInitialPath() {
		return this.props.initialPath;
	}

	getCurrentPageData() {
		return this.state.currentPage;
	}

	isDefault() {
		return !!this.props.default;
	}

	/** Sets a page to be rendered. This will animate out the current page and transition in a new page.
	 * @param page - Page to be shown in the current view
	 * @param path - Path including any query parameters */
	setPage(page: ReactPage, path: string) {
		return new Promise<void>((resolve) => this.setState({ currentPage: page, path }, resolve));
	}

	back(page: ReactPage, path: string) {
		this.setState({ navigatingBack: true });
		return this.setPage(page, path);
	}

	renderPages() {
		const toRender: JSX.Element[] = [];
		if (this.state.transitionToPage && this.state.navigatingBack) {
			const Page = this.state.transitionToPage;
			toRender.push(React.createElement(Page, { key: 'backPage' }));
		}

		if (this.state.currentPage) {
			const Page = this.state.currentPage;
			toRender.push(React.createElement(Page, { key: 'page' }));
		}

		if (this.state.transitionToPage && !this.state.navigatingBack) {
			const Page = this.state.transitionToPage;
			toRender.push(React.createElement(Page, { key: 'forwardPage' }));
		}

		return toRender;
	}

	render() {
		return (
			<div id={this.props.id} className="rs-view rsView" ref={this.viewElement}>
				{this.renderPages()}
			</div>
		);
	}
}
