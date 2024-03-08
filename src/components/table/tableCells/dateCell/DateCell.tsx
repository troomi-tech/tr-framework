import React from 'react';
import Label, { LabelProps } from '../../../label/Label';
import BaseCell, { BaseCellProps } from '../BaseCell';

export interface DateCellProps extends BaseCellProps<number | string | Date> {
	/* ~~~~~~ Advanced ~~~~~~ */

	/** The options that will be passed to the Date.toLocaleDateString function. */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** The variant of the label that will be rendered. @see {@link Label} */
	variant?: LabelProps['variant'];
}

const DateCell: React.FC<DateCellProps> = (props) => {
	const { variant = 'body1', formatOptions, ...baseCellProps } = props;

	function getClassName() {
		const classes = ['rsDateCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			<Label variant={variant}>{new Date(baseCellProps.data).toLocaleDateString('en-US', formatOptions)}</Label>
		</BaseCell>
	);
};

export default DateCell;
