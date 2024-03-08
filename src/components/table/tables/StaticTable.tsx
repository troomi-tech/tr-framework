import React from 'react';
import './StaticTable.scss';
import TableHead from '../tablePieces/tableHead/TableHead';
import TableBody from '../tablePieces/tableBody/TableBody';
import TableFooter from '../tablePieces/tableFooter/TableFooter';
import { ColumnDetail } from '../ColumnDetail';
import TableRow, { TableRowProps } from '../tablePieces/tableRow/TableRow';

export type StaticTableProps<T = Record<string, any>> = {
	/* ~~~~~~ Required ~~~~~~ */

	/** An array of objects that describe each column in the table.
	 * The order of the columns in this array will be the order they are displayed in the table.
	 * Each object must have a `accessor` property that is used to get the data from the data object.
	 * @see {@link ColumnDetails}  */
	columns: ColumnDetail<T>[];
	/** Typically takes an array of objects that represent the data to be displayed in the table.
	 * Can take any type of data, but it must be compatible with the `accessor` property of the `columns` prop.
	 * @see {@link ColumnDetails} */
	data: T[];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the table, will always contain 'rsStaticTable' */
	className?: string;
	/** The id of the table */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Called when the user clicks a row in the table
	 * @param {T} data The data of the row that was clicked
	 * @param {number} index The index of the row that was clicked */
	onRowClick?: (data: T, index: number) => void;
	/** Called when the user clicks a cell in the row
	 * @param {T} value The value of the cell that was clicked
	 * @param {number} index The index of the cell that was clicked */
	onCellClick?: TableRowProps['onCellClick'];
	/** The content to display in the footer of the table */
	footerContent?: React.ReactNode;
	/** The component to render while the table is loading.
	 * Will be displayed in the table body
	 * @default 'Loading...'' */
	loadingComponent?: React.ReactNode;
	/** Whether or not the table is loading.
	 * While the table is loading it will show the `loadingComponent` instead of the table rows
	 * @default false */
	isLoading?: boolean;
};

const StaticTable: React.FC<StaticTableProps> = (props) => {
	const {
		loadingComponent = 'Loading...',
		isLoading = false,
		footerContent,
		className,
		columns,
		data,
		id,
		onCellClick,
		onRowClick
	} = props;

	function getClassName() {
		const classes = ['rsStaticTable'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function renderRows() {
		if (!!isLoading)
			return (
				<tr>
					<td colSpan={columns.length}>{loadingComponent}</td>
				</tr>
			);

		return data.map((data, index) => {
			const handleRowClick = !!onRowClick ? () => onRowClick(data, index) : undefined;

			return (
				<TableRow
					onCellClick={onCellClick}
					onClick={handleRowClick}
					columns={columns}
					rowIndex={index}
					data={data}
					key={index}
				/>
			);
		});
	}

	return (
		<table className={getClassName()} id={id}>
			<TableHead id={id && `${id}TableHead`} columns={columns} />
			<TableBody id={id && `${id}TableBody`}>{renderRows()}</TableBody>
			<TableFooter id={id && `${id}TableFooter`}>{footerContent}</TableFooter>
		</table>
	);
};

export default StaticTable;
