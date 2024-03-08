import React, { Component, createRef } from 'react';
import './Popup.scss';
import domUtils from '../utils/DomUtils';
import popupController from './popupController';
import PopupProps from './PopupProps';

export default class Popup extends Component<PopupProps, {}> {
	componentDidMount = () => {
		this.updateClasses();
		window.addEventListener('keydown', this.keyListener);
	};

	componentWillUnmount = () => {
		window.removeEventListener('keydown', this.keyListener);
	};

	popupElement = createRef<HTMLDivElement>();
	popupContentElement = createRef<HTMLDivElement>();
	mouseDownTarget: HTMLDivElement | null = null;

	keyListener = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (this.props.preventCloseByEscapeKey) return;
			this.closeSelf();
		}
	};

	closeSelf = async () => {
		if (this.props.onClose && !(await this.props.onClose())) return;
		popupController.closeLast();
	};

	componentWillUpdate = () => {
		this.updateClasses();
	};

	updateClasses = () => {
		setTimeout(() => {
			if (this.props.opened) {
				if (domUtils.hasClass(this.popupElement.current, 'hidden')) {
					domUtils.removeClass(this.popupElement.current, 'hidden');
					setTimeout(() => {
						domUtils.addClass(this.popupElement.current, 'show');
					}, 10);
				} else {
					domUtils.addClass(this.popupElement.current, 'show');
				}
			} else {
				domUtils.removeClass(this.popupElement.current, 'show');
				setTimeout(() => {
					domUtils.addClass(this.popupElement.current, 'hidden');
				}, 400);
			}
		}, 100);
	};

	classes = () => {
		let classes = ['rs-popup-content'];
		if (this.props.className) {
			classes.push(this.props.className);
		}
		return classes.join(' ');
	};

	handleMouseUp = (e: any) => {
		if (this.props.preventCloseByBackgroundClick) return;
		if (
			e.target === this.popupContentElement.current &&
			this.mouseDownTarget === this.popupContentElement.current
		) {
			this.closeSelf();
		}
	};

	handleMouseDown = (e: any) => {
		if (this.props.preventCloseByBackgroundClick) return;
		this.mouseDownTarget = e.target;
	};

	render() {
		let popupId = this.props.popupId ? this.props.popupId : `popup-${Math.floor(Math.random() * 10000)}`;

		return (
			<div
				onMouseUp={this.handleMouseUp}
				onMouseDown={this.handleMouseDown}
				className="rs-popup"
				ref={this.popupElement}
				id={popupId}
			>
				<div className={this.classes()} ref={this.popupContentElement}>
					{this.props.children}
				</div>
			</div>
		);
	}
}
