import React from 'react';
import './TooltipMessage.scss';
import './TooltipMessageLooks.scss';

export interface TooltipMessageProps {
	/** @description The label to display in the Tooltip */
	label: React.ReactNode;
	/** @description The background color of the Tooltip */
	backgroundColor?: string;
	/** @description The text color of the Tooltip */
	textColor?: string;
	/** @description allows the mouse pointer to hover over tooltip message without it dissapearing  */
	interactive?: boolean;
	/** @description The look of the Tooltip @default 'standard' */
	look?: 'standard' | 'filled' | 'outlined' | 'none';
	/** @description The transition of the Tooltip @default 'none' */
	transition?: 'fade' | 'flip' | 'none';
	/** @description The position of the Tooltip @default 'top' */
	position?: 'top' | 'right' | 'bottom' | 'left';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	className?: string;
	style?: React.CSSProperties;
}

const TooltipMessage: React.FC<TooltipMessageProps> = (props) => {
	function getClasses(): string {
		return [
			'rsTooltip',
			props.className ?? '',
			props.look ?? 'standard',
			props.position ?? 'top',
			props.transition ? `transition-${props.transition}` : 'transition-none',
			props.interactive ? 'interactive' : ''
		].join(' ');
	}

	return (
		<div
			onClick={props.onClick}
			style={{
				backgroundColor: props.backgroundColor,
				color: props.textColor,
				...props.style
			}}
			className={getClasses()}
		>
			<div className="tooltipBottom"></div>
			{props.label}
		</div>
	);
};
export default TooltipMessage;
