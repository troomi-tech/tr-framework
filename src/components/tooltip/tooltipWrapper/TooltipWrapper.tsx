import './TooltipWrapper.scss';
import React, { useEffect, useState } from 'react';
import useTimeout from '../../../hooks/useTimeout';
import TooltipMessage, { TooltipMessageProps } from '../tooltipMessage/TooltipMessage';

export const TOOLTIP_DEFAULT_SHOW_DELAY = 400;
export const TOOLTIP_DEFAULT_HIDE_DELAY = 0;

export interface TooltipProperties extends TooltipWrapperProps {
	wrapContents?: boolean;
}

export interface TooltipWrapperProps extends TooltipMessageProps, React.PropsWithChildren {
	/** @description Callback function that is called when the Tooltip is shown */
	onShow?: () => void;
	/** @description Callback function that is called when the Tooltip is hidden */
	onHide?: () => void;
	/** @description The time it takes for for the Tooltip to display in Milliseconds @default 400 */
	showDelay?: number;
	/** @description The time it takes for for the Tooltip to hide in Milliseconds @default 0 */
	hideDelay?: number;
	/** @description Disables the Tooltip from showing */
	disabled?: boolean;
	/** @description The aria-label for the Tooltip */
	ariaLabel?: string;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = (props) => {
	const {
		showDelay = TOOLTIP_DEFAULT_SHOW_DELAY,
		hideDelay = TOOLTIP_DEFAULT_HIDE_DELAY,
		disabled,
		ariaLabel,
		onHide,
		onShow,
		...tooltipProps
	} = props;
	const [active, setActive] = useState(false);

	const showTimeout = useTimeout(showTooltip, showDelay);
	const hideTimeout = useTimeout(hideTooltip, hideDelay);

	useEffect(() => {
		showTimeout.clear();
		hideTimeout.clear();
	}, [showTimeout, hideTimeout]);

	function showTooltip() {
		if (disabled) return;
		if (onShow) onShow();
		setActive(true);
	}

	function hideTooltip() {
		if (disabled) return;
		if (onHide) onHide();
		setActive(false);
	}

	function startShowingTooltip() {
		if (disabled) return;
		hideTimeout.clear();
		showTimeout.reset();
	}

	function startHidingTooltip() {
		showTimeout.clear();
		hideTimeout.reset();
	}

	function generateAriaLabel() {
		if (ariaLabel) return ariaLabel;
		if (typeof tooltipProps.label === 'string') return tooltipProps.label;
		return undefined;
	}

	return (
		<div
			className={'rsTooltipWrapper'}
			onMouseEnter={startShowingTooltip}
			onMouseOver={startShowingTooltip}
			onMouseLeave={startHidingTooltip}
			aria-label={generateAriaLabel()}
			onTouchStart={() => {
				showTooltip();
				showTimeout.clear();
			}}
		>
			{props.children}
			{active && !disabled && <TooltipMessage {...tooltipProps} />}
		</div>
	);
};

export default TooltipWrapper;
