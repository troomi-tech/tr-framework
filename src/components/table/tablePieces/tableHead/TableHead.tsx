import React from 'react';
import './TableHead.scss';
import TableRow from '../tableRow/TableRow';
import { ColumnDetail } from '../../ColumnDetail';

export interface TableHeadProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The columns details used to render in the table head. */
	columns: ColumnDetail[];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name that will be applied to the thead. Will always contain 'rsTableHeader'. */
	className?: string;
	/** The id that will be applied to the thead. */
	id?: string;
}

const TableHead: React.FC<TableHeadProps> = (props) => {
	const { columns, className, id } = props;

	function getClassName() {
		const classes = ['rsTableHeader'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	return (
		<thead className={getClassName()} id={id}>
			<TableRow columns={columns} isHeader rowIndex={-1} />
		</thead>
	);
};

export default TableHead;
