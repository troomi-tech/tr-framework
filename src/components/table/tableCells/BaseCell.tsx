import React from 'react';
import './BaseCell.scss';

export interface BaseCellProps<T = unknown> extends React.PropsWithChildren {
	/* ~~~~~~ Required ~~~~~~ */

	/** The data that will be passed to the cell. */
	data: T;
	/** The index of the column that the cell is in. */
	columnIndex: number;
	/** The index of the row that the cell is in. */
	rowIndex: number;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name that will be applied to the cell. Will always contain 'rsBaseCell'. */
	className?: string;
	/** The id that will be applied to the cell. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The function that will be called when the cell is clicked.
	 * @param {any} data The data that is passed to the cell.
	 * @param {number} columnIndex The index of the column that the cell is in.
	 * @param {number} rowIndex The index of the row that the cell is in. */
	onClick?: (data: T extends unknown ? any : T, columnIndex: number, rowIndex: number) => void;
	/** Whether or not the cell is a header cell. @default false */
	isHeader?: boolean;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The style of the cell */
	style?: React.CSSProperties;
}

const BaseCell: React.FC<BaseCellProps> = (props) => {
	const { isHeader = false, className, id, data, style, columnIndex, rowIndex, onClick } = props;

	function getClassName() {
		const classes = ['rsBaseCell'];
		if (!!className) classes.push(className);
		if (!!onClick) classes.push('clickable');
		if (!!isHeader) classes.push('header');

		return classes.join(' ');
	}

	function renderBaseCell() {
		const tagProps = {
			onClick: () => onClick?.(data, columnIndex, rowIndex),
			className: getClassName(),
			style,
			id
		};

		if (!isHeader) return <td {...tagProps}>{props.children}</td>;
		return <th {...tagProps}>{props.children}</th>;
	}

	return renderBaseCell();
};

export default BaseCell;
