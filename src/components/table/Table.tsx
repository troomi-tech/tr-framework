import React from 'react';
import './Table.scss';
import InfiniteTable, { InfiniteTableProps } from './tables/infiniteTable/InfiniteTable';
import PaginationTable, { PaginationTableProps } from './tables/paginationTable/PaginationTable';
import StaticTable, { StaticTableProps } from './tables/StaticTable';

type ConditionalAdvancedTableProps<T extends object> =
	| ({ type?: 'pagination' } & PaginationTableProps<T>)
	| ({ type: 'infinite-scroll' } & InfiniteTableProps<T>)
	| ({ type: 'static' } & StaticTableProps);

export type TableProps<T extends object = Record<string, any>> = ConditionalAdvancedTableProps<T>;

/** A utility component for displaying multiple types of tables. */
const Table: React.FC<TableProps> = (props) => {
	const newProps = {
		...props,
		className: props.className ? `rsTable ${props.className}` : 'rsTable'
	} as typeof props & { className: string };

	switch (newProps.type) {
		case 'pagination':
			return <PaginationTable {...newProps} />;
		case 'infinite-scroll':
			return <InfiniteTable {...newProps} />;
		case 'static':
			return <StaticTable {...newProps} />;
		default:
			return <PaginationTable {...newProps} />;
	}
};

export default Table;
