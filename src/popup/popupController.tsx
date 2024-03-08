import React, { Component } from 'react';
import PopupProps from '../popup/PopupProps';

const APPROXIMATE_HIDE_DELAY_MS = 400;

interface Popup {
	component: React.Component | React.FC;
	props: any;
}

interface PopupControllerState {
	popups: Popup[];
}

export class PopupController extends Component<{}, PopupControllerState> {
	private activePopupSubscriptions: { [id: number]: (popups: Popup[]) => void } = {};
	constructor(props: {}) {
		super(props);
		this.state = {
			popups: []
		};
	}

	open = (component: React.Component | React.FC, props: any = {}) => {
		props.opened = true;
		this.setState(({ popups }) => {
			let addNewPopup = true;
			if (props.popupId) {
				for (let popup of popups) {
					if (popup.props.popupId === props.popupId) {
						addNewPopup = false;
						popup.props = props;
					}
				}
			}
			if (addNewPopup) {
				const newPopups = [...popups, { component, props }];
				this.fireSubscriptionCallbacks(newPopups);
				return { popups: newPopups };
			}

			this.fireSubscriptionCallbacks(popups);
			return { popups };
		});
	};

	_matchComponent = (component1: any, component2: any) => {
		if (!component1) return false;
		if (!component2) return false;
		if (component1 === component2) return true;
		if (component1 === component2.constructor) return true;
		return false;
	};

	hide = (component: any) => {
		let { popups } = this.state;
		for (let i in popups) {
			if (this._matchComponent(popups[i].component, component)) {
				popups[i].props.opened = false;
			}
		}
		this.setState({ popups });
	};

	closeAll = () => {
		let { popups } = this.state;
		for (let i in popups) {
			popups[i].props.opened = false;
		}
		setTimeout(() => {
			this.setState({ popups: [] });
		}, APPROXIMATE_HIDE_DELAY_MS);
		this.setState({ popups });
		this.fireSubscriptionCallbacks([]);
	};

	closeLast = () => {
		this.setState(({ popups }) => {
			if (popups.length === 0) return { popups };
			const newPopups = popups.slice(0, popups.length - 1);

			this.fireSubscriptionCallbacks(newPopups);
			return { popups: newPopups };
		});
	};

	close = (component: any) => {
		let { popups } = this.state;
		let popupsToRemove: number[] = [];
		for (let i in popups) {
			if (this._matchComponent(popups[i].component, component)) {
				popups[i].props.opened = false;
				popupsToRemove.push(parseInt(i));
			}
		}
		if (popupsToRemove) {
			this.setState(({ popups }) => {
				const newPopups = popups.filter((_, index) => {
					return !popupsToRemove.includes(index);
				});

				this.fireSubscriptionCallbacks(newPopups);
				return {
					popups: newPopups
				};
			});
		}
	};

	render() {
		let comps = [];
		for (let i in this.state.popups) {
			let Comp: any = this.state.popups[i].component;
			let props = this.state.popups[i].props;
			comps.push(
				<Comp
					key={i}
					onHide={() => {
						this.close(Comp);
					}}
					{...props}
				/>
			);
		}
		if (comps.length > 0) return comps;
		return null;
	}

	fireSubscriptionCallbacks(popups: Popup[]) {
		Object.values(this.activePopupSubscriptions).forEach((callback) => {
			callback(popups);
		});
	}

	/**
	 * Add callback and subscribe to popup event
	 * @param {ActiveViewChangedCallback} callback
	 * @returns {number}
	 */
	subscribeToPopupEvent(callback: (popup: Popup[]) => void): number {
		const id = Date.now();
		this.activePopupSubscriptions[id] = callback;
		return id;
	}

	/**
	 * Remove subscribed callback of popup event
	 * @param id
	 */
	unsubscribeFromPopupEvent(id: number) {
		delete this.activePopupSubscriptions[id];
	}
}

interface PopupControllerInterface {
	open: <T extends PopupProps>(Comp: any, props?: T) => void;
	hide: (Comp: any) => void;
	close: (Comp: any) => void;
	closeLast: () => void;
	closeAll: () => void;
	instance: any;
	subscribeToPopupEvent: (callback: (popup: Popup[]) => void) => number;
	unsubscribeFromPopupEvent: (id: number) => void;
}

let pc: any = {};
let popupController: PopupControllerInterface = {
	open: (Comp: any, props?: any) => {
		pc?.open(Comp, props);
	},
	hide: (Comp: any) => {
		pc?.hide(Comp);
	},
	close: (Comp: any) => {
		pc?.close(Comp);
	},
	closeLast: () => {
		pc?.closeLast();
	},
	closeAll: () => {
		pc?.closeAll();
	},
	instance: <PopupController ref={(ref) => (pc = ref)} />,
	subscribeToPopupEvent: (callback: (popup: Popup[]) => void) => {
		return pc?.subscribeToPopupEvent(callback);
	},
	unsubscribeFromPopupEvent: (id: number) => {
		pc?.unsubscribeFromPopupEvent(id);
	}
};

export default popupController;
