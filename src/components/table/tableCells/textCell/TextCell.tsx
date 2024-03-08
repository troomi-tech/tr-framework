import React from 'react';
import Label, { LabelProps } from '../../../label/Label';
import BaseCell, { BaseCellProps } from '../BaseCell';

export interface TextCellProps extends BaseCellProps<string> {
	/* ~~~~~~ Styling ~~~~~~ */

	/** The variant of the label that will be rendered. @see {@link Label} */
	variant?: LabelProps['variant'];
}

const TextCell: React.FC<TextCellProps> = (props) => {
	const { variant, ...baseCellProps } = props;

	function getClassName() {
		const classes = ['rsTextCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			<Label variant={variant}>{baseCellProps.data}</Label>
		</BaseCell>
	);
};

export default TextCell;
