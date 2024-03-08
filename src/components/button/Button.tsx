import React, { CSSProperties, MouseEvent, forwardRef } from 'react';
import './Button.scss';
import './ButtonLooks.scss';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

type ButtonLooks =
	| 'containedPrimary'
	| 'containedSecondary'
	| 'containedTertiary'
	| 'textPrimary'
	| 'textSecondary'
	| 'textTertiary'
	| 'outlinedPrimary'
	| 'outlinedSecondary'
	| 'outlinedTertiary'
	| 'custom'
	| 'none';

export interface ButtonProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The content of the button */
	children: React.ReactNode;
	/** The look of the button */
	look: ButtonLooks;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The onClick event handler */
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	/** The className of the button. Will always contain `rsButton` */
	className?: string;
	/** The id of the button */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** If true, the button will have the `small` class  @default false*/
	small?: boolean;
	/** if true, the ripple effect will be disabled @default false */
	disableRipple?: boolean;
	/** Whether or not the button is disabled @default false */
	disabled?: boolean;
	/** The type of the button @default 'button' */
	type?: 'button' | 'submit';

	/* ~~~~~~ Styling ~~~~~~ */

	/** The background color of the button */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The text color of the button */
	textColor?: CSSProperties['color'];
	/** The style of the button */
	style?: CSSProperties;

	/* ~~~~~~ Tooltip ~~~~~~ */

	/** If provided, will wrap the contents of the button in a `tooltipWrapper` */
	tooltipProperties?: TooltipProperties;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const {
		disableRipple = false,
		disabled = false,
		type = 'button',
		small = false,
		tooltipProperties,
		backgroundColor,
		textColor,
		className,
		style,
		look,
		id,
		onClick
	} = props;

	function rippleEffect(event: MouseEvent<HTMLElement>) {
		const targetBoundingRect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - targetBoundingRect.x;
		const y = event.clientY - targetBoundingRect.y;
		const ripples = document.createElement('span');
		ripples.style.left = `${x}px`;
		ripples.style.top = `${y}px`;
		ripples.classList.add('ripple');
		event.currentTarget.appendChild(ripples);
		setTimeout(() => ripples.remove(), 600);
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!textColor) styles.color = textColor;

		return { ...styles, ...style };
	}

	function getClassName() {
		const classes = ['rsButton'];
		const lookToLowerCase = look.toLowerCase();

		if (lookToLowerCase.includes('secondary')) classes.push('secondary');
		if (lookToLowerCase.includes('contained')) classes.push('contained');
		if (lookToLowerCase.includes('outlined')) classes.push('outlined');
		if (lookToLowerCase.includes('tertiary')) classes.push('tertiary');
		if (lookToLowerCase.includes('primary')) classes.push('primary');
		if (lookToLowerCase.includes('text')) classes.push('text');
		if (lookToLowerCase === 'custom') classes.push('custom');
		if (lookToLowerCase === 'none') classes.push('none');
		if (!!tooltipProperties && !!tooltipProperties.wrapContents) classes.push('wrappingTooltip');
		if (!!className) classes.push(className);
		if (!!small) classes.push(`small`);

		return classes.join(' ');
	}

	function handleClick(e: MouseEvent<HTMLButtonElement>) {
		if (!disableRipple) rippleEffect(e);
		if (!!onClick) onClick(e);
	}

	function renderSingleButton(children: React.ReactNode) {
		return (
			<button
				disabled={disabled}
				type={type}
				id={id}
				className={getClassName()}
				onClick={handleClick}
				style={getStyle()}
				ref={ref}
			>
				{children}
			</button>
		);
	}

	function renderButton() {
		if (!tooltipProperties) return renderSingleButton(props.children);
		if (!!tooltipProperties.wrapContents)
			return renderSingleButton(<TooltipWrapper {...tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...tooltipProperties}>{renderSingleButton(props.children)}</TooltipWrapper>;
	}

	return renderButton();
});

export default Button;
