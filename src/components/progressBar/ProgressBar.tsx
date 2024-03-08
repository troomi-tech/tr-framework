import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import './ProgressBarLooks.scss';
import './ProgressBar.scss';

type ProgressBarLooks = 'primary' | 'secondary' | 'none';

export interface ProgressBarProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The percentage of the progress bar. Min: 0, Max: 100 */
	percentage: number;

	/* ~~~~~~ Basic ~~~~~~ */

	/** Called when the progress bar is clicked */
	onClick?: () => void;
	/** The class name of the progress bar. Will always contain 'rsProgressBar' */
	className?: string;
	/** The id of the progress bar */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Sets the text alignment of the indicator @default 'center'*/
	indicatorPosition?: CSSProperties['textAlign'];
	/** The background and text color of the progress bar. @default 'primary' */
	look?: ProgressBarLooks;
	/** The content of the indicator. @default `${props.percentage}% Complete` */
	indicatorContent?: ReactNode;
	/** Whether or not to show the indicator @default true */
	hasIndicator?: boolean;
	/** Whether or not the progress bar is striped @default false */
	isStriped?: boolean;
	/** If true the bar will slowly scroll from left to right @default false */
	isAnimated?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>((props, ref) => {
	const percentage = Math.max(0, Math.min(100, props.percentage));
	const {
		indicatorContent = `${percentage}% Complete`,
		indicatorPosition = 'center',
		hasIndicator = true,
		isAnimated = false,
		isStriped = false,
		look = 'primary',
		className,
		id,
		onClick
	} = props;

	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const innerBar = innerRef.current;
		if (!innerBar) return;
		innerBar.style.setProperty('--_progress', `${percentage / 100}`);
	}, [percentage, innerRef]);

	function getClassName() {
		const classes = ['rsProgressBar'];
		if (!!className) classes.push(className);
		if (!!look) classes.push(look);

		return classes.join(' ');
	}

	function getInnerClassName() {
		const classes = ['rsProgressBarInner'];
		if (!!isStriped) classes.push('striped');
		if (!!isAnimated) classes.push('animated');

		return classes.join(' ');
	}

	function getInnerStyle() {
		const styles: CSSProperties = {};
		if (!!indicatorPosition) styles.textAlign = indicatorPosition;

		return styles;
	}

	function renderIndicator() {
		if (!hasIndicator) return null;
		return <span className="rsProgressIndicator">{indicatorContent}</span>;
	}

	return (
		<div id={id} className={getClassName()} onClick={onClick} ref={ref}>
			<div
				id={id && `${id}Inner`}
				style={getInnerStyle()}
				className={getInnerClassName()}
				role="progressbar"
				aria-valuenow={percentage}
				aria-valuemax={100}
				aria-valuemin={0}
				ref={innerRef}
			>
				{renderIndicator()}
			</div>
		</div>
	);
});

export default ProgressBar;
