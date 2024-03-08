import React from 'react';
import BaseCell, { BaseCellProps } from '../BaseCell';

export interface CustomCellProps extends BaseCellProps<any> {
	/* ~~~~~~ Required ~~~~~~ */

	/** The function that will be called to render the custom content.
	 * @param {any} data The data that is passed to the cell.
	 * @returns The JSX that will be rendered. */
	customContentHandler: (data: any) => React.ReactNode;
}

const CustomCell: React.FC<CustomCellProps> = (props) => {
	const { customContentHandler, ...baseCellProps } = props;

	function getClassName() {
		const classes = ['rsCustomCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			{customContentHandler(baseCellProps.data)}
		</BaseCell>
	);
};

export default CustomCell;
