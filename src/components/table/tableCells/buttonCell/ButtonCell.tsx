import React from 'react';
import './ButtonCell.scss';
import BaseCell, { BaseCellProps } from '../BaseCell';
import Button, { ButtonProps } from '../../../button/Button';

export interface ButtonCellProps extends BaseCellProps<React.ReactNode> {
	/* ~~~~~~ Required ~~~~~~ */

	/** The function that will be called when the button is clicked. */
	onButtonClick: ButtonProps['onClick'];

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether or not the button is disabled @default false */
	disabled?: ButtonProps['disabled'];
	/** If true, the button will have the `small` class @default true */
	small?: ButtonProps['small'];
	/** If true, the button's ripple effect will be disabled @default false */
	disableRipple?: ButtonProps['disableRipple'];
	/** The look of the button that will be rendered around the data @default 'custom' */
	look?: ButtonProps['look'];

	/* ~~~~~~ Styling ~~~~~~ */

	/** The background color of the button */
	backgroundColor?: ButtonProps['backgroundColor'];
	/** The text color of the button */
	textColor?: ButtonProps['textColor'];

	/* ~~~~~~ Tooltip ~~~~~~ */

	/** If provided, will wrap the contents of the button in a `tooltipWrapper` */
	tooltipProperties?: ButtonProps['tooltipProperties'];
}

const ButtonCell: React.FC<ButtonCellProps> = (props) => {
	const {
		look = 'custom',
		disableRipple = false,
		disabled = false,
		small = true,
		tooltipProperties,
		backgroundColor,
		textColor,
		onButtonClick,
		...baseCellProps
	} = props;

	function getClassName() {
		const classes = ['rsButtonCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	function renderContent() {
		const { data } = baseCellProps;
		if (!data) return null;
		if (React.isValidElement(data)) return baseCellProps.data;
		return String(baseCellProps.data);
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			<Button
				onClick={onButtonClick}
				style={{ width: '100%' }}
				tooltipProperties={tooltipProperties}
				backgroundColor={backgroundColor}
				disableRipple={disableRipple}
				textColor={textColor}
				disabled={disabled}
				small={small}
				look={look}
			>
				{renderContent()}
			</Button>
		</BaseCell>
	);
};

export default ButtonCell;
