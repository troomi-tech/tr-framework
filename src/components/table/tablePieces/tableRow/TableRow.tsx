import React from 'react';
import './TableRow.scss';
import { ColumnDetail } from '../../ColumnDetail';
import TableCell from '../tableCell/TableCell';

type ConditionalIsHeaderProps = {
	/** No data is needed for header rows */
	data?: never;
	/** Called when the user clicks a cell in the row
	 * @param {ColumnDetail['label']} value The value of the cell that was clicked
	 * @param {number} index The index of the cell that was clicked */
	onCellClick?: (value: ColumnDetail['label'], index: number) => void;
	/** Called when the user clicks the row
	 * @param {ColumnDetail['label'][]} value The value of the row that was clicked */
	onClick?: (value: ColumnDetail['label'][]) => void;
	/** The index of the row in the table. Starts at 0 not including the header row
	 * The index of the header row is -1 */
	rowIndex: -1;
};
type ConditionalIsNotHeaderProps<T = any> = {
	/** The data to display in the row */
	data: T;
	/** Called when the user clicks a cell in the row
	 * @param {T} value The value of the cell that was clicked
	 * @param {number} columnIndex The index of the cell that was clicked
	 * @param {number} rowIndex The index of the row that was clicked */
	onCellClick?: (value: T, columnIndex: number, rowIndex: number) => void;
	/** Called when the user clicks the row
	 * @param {T} value The value of the row that was clicked
	 * @param {number} index The index of the row that was clicked */
	onClick?: (data: T, index: number) => void;
	/** The index of the row in the table. Starts at 0 not including the header row
	 * The index of the header row is -1 */
	rowIndex: number;
};

type ConditionalTableRowProps =
	| ({ isHeader: true } & ConditionalIsHeaderProps)
	| ({ isHeader?: false } & ConditionalIsNotHeaderProps);

export type TableRowProps = {
	/* ~~~~~~ Required ~~~~~~ */

	/** The column details used to render the cells in the row */
	columns: ColumnDetail[];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the row, will always contain 'rsTableRow' */
	className?: string;
	/** The id of the row */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether or not the row is a header row @default false */
	isHeader?: boolean;
} & ConditionalTableRowProps;

const TableRow: React.FC<TableRowProps> = (props) => {
	const { isHeader = false, columns, data, rowIndex, className, id, onClick, onCellClick } = props;

	function getHeaderData(): ColumnDetail['label'][] {
		return columns.map((column) => column.label);
	}

	function getClassName() {
		const classes = ['rsTableRow'];

		if (!!className) classes.push(className);
		if (!!isHeader) classes.push('header');
		if (!!onClick) classes.push('clickable');

		return classes.join(' ');
	}

	function handleClick() {
		if (!onClick) return;
		if (isHeader) onClick(getHeaderData(), -1);
		else onClick(data, rowIndex);
	}

	function buildDataFromAccessor(columnAccessor: ColumnDetail['accessor'], data: any) {
		const accessors = typeof columnAccessor === 'string' ? columnAccessor.split('.') : [columnAccessor];
		let value = data;
		for (const accessor of accessors) value = value?.[accessor];
		return value;
	}

	function buildTableCellClick(column: ColumnDetail, columnIndex: number, rowIndex: number) {
		const { onClick } = column;
		const cellData = isHeader ? column.label : buildDataFromAccessor(column.accessor, data);
		const computedRowIndex = isHeader ? -1 : rowIndex;
		if (!onClick && !onCellClick) return;

		return () => {
			if (!!onClick) onClick(cellData, columnIndex, computedRowIndex);
			if (!!onCellClick) onCellClick(cellData, columnIndex, computedRowIndex);
		};
	}

	function renderCells() {
		return columns.map((column, index) => {
			const { accessor, ...rest } = column;
			const cellData = isHeader ? column.label : buildDataFromAccessor(accessor, data);

			return (
				<TableCell
					onClick={buildTableCellClick(column, index, rowIndex)}
					columnIndex={index}
					rowIndex={rowIndex}
					isHeader={isHeader}
					data={cellData}
					{...rest}
					key={index}
				/>
			);
		});
	}

	return (
		<tr className={getClassName()} id={id} onClick={handleClick}>
			{renderCells()}
		</tr>
	);
};

export default TableRow;
