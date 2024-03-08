import React, { CSSProperties, MouseEvent, PropsWithChildren, forwardRef } from 'react';
import SpacingUtils, { SpacingProps } from '../../utils/SpacingUtils';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

export interface BoxProps extends PropsWithChildren, SpacingProps {
	/* ~~~~ Basic ~~~~ */

	/** The className of the box. Will always contain `rsBox` */
	className?: string;
	/** The onClick event handler */
	onClick?: (event: MouseEvent) => void;
	/** The id of the box */
	id?: string;

	/* ~~~~ Tooltip ~~~~ */

	/** If provided, will wrap the contents of the box in a `tooltipWrapper` */
	tooltipProperties?: TooltipProperties;

	/* ~~~~ Styling ~~~~ */

	/** The style of the box */
	style?: CSSProperties;
}

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
	// Based on prop value we might perform some transformations (i.e. m = margin, etc.)
	const { className, id, tooltipProperties, style, onClick, ...other } = props;
	const cssProperties = { ...SpacingUtils.getCssProperties(other), ...style };
	const computedClassName = !!className ? `rsBox ${className}` : 'rsBox';

	function renderSingleBox(children: React.ReactNode) {
		return (
			<div id={id} ref={ref} className={computedClassName} style={cssProperties} onClick={onClick}>
				{children}
			</div>
		);
	}

	function renderBox() {
		if (!tooltipProperties) return renderSingleBox(props.children);
		if (tooltipProperties.wrapContents)
			return renderSingleBox(<TooltipWrapper {...tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...tooltipProperties}>{renderSingleBox(props.children)}</TooltipWrapper>;
	}

	return renderBox();
});

export default Box;
