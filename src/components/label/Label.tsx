import React, { CSSProperties, PropsWithChildren } from 'react';
import './Label.scss';
import './LabelVariants.scss';
import SpacingUtils, { SpacingProps } from '../../utils/SpacingUtils';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';
import { LabelVariants } from './LabelVariants';

export interface LabelProps extends PropsWithChildren, SpacingProps {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the label. Will always contain `rsLabel` */
	className?: string;
	/** The id of the label */
	id?: string;
	/** The onClick event handler */
	onClick?: () => void;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Adds the class to label each has prebuilt CSS inside. @see{@link LabelVariants} */
	variant?: LabelVariants;
	/** Alternative to children. If provided, will render this text instead of children */
	text?: string;
	/** The id of the element the label is for.
	 * If provided, will render a `label` element rather than a `div` */
	htmlFor?: string;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The CSS `text-overflow` property */
	textOverflow?: CSSProperties['textOverflow'];
	/** The CSS `white-space` property */
	whiteSpace?: CSSProperties['whiteSpace'];
	/** The CSS `overflow` property */
	overflow?: CSSProperties['overflow'];
	/** The background color of the label */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The text color of the label */
	textColor?: CSSProperties['color'];
	/** Additional CSS styles to apply to the label */
	style?: CSSProperties;

	/* ~~~~~~ Tooltip ~~~~~~ */

	/** If provided, will wrap the contents of the button in a `tooltipWrapper` */
	tooltipProperties?: TooltipProperties;
}

const Label = React.forwardRef<HTMLDivElement & HTMLLabelElement, LabelProps>((props, ref) => {
	const {
		tooltipProperties,
		backgroundColor,
		textOverflow,
		whiteSpace,
		textColor,
		className,
		overflow,
		htmlFor,
		variant,
		style,
		text,
		id,
		onClick,
		...spacingProps
	} = props;

	function getClassName() {
		const classes = ['rsLabel'];
		if (!!className) classes.push(className);
		if (!!variant) classes.push(variant);

		return classes.join(' ');
	}

	function getStyle() {
		const styles = SpacingUtils.getCssProperties(spacingProps);
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!textOverflow) styles.textOverflow = textOverflow;
		if (!!whiteSpace) styles.whiteSpace = whiteSpace;
		if (!!overflow) styles.overflow = overflow;
		if (!!textColor) styles.color = textColor;

		return { ...styles, ...style };
	}

	function renderSingleLabel(children: React.ReactNode) {
		const labelProps = {
			className: getClassName(),
			style: getStyle(),
			onClick,
			htmlFor,
			ref,
			id
		};

		if (!htmlFor) return <div {...labelProps}>{children}</div>;
		else return <label {...labelProps}>{children}</label>;
	}

	function renderLabel() {
		const children = text ?? props.children;
		if (!tooltipProperties) return renderSingleLabel(children);
		if (tooltipProperties.wrapContents)
			return renderSingleLabel(<TooltipWrapper {...tooltipProperties}>{children}</TooltipWrapper>);
		else return <TooltipWrapper {...tooltipProperties}>{renderSingleLabel(children)}</TooltipWrapper>;
	}

	return renderLabel();
});

export default Label;
