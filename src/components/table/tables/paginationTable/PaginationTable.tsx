import React, { useEffect, useState } from 'react';
import './PaginationTable.scss';
import TableSearch, { TableSearchProps } from '../../tablePieces/tableSearch/TableSearch';
import { PageQuery, StandardOrderTypes } from '../../PageQuery';
import TablePagination from '../../tablePieces/tablePagination/TablePagination';
import StaticTable, { StaticTableProps } from '../StaticTable';
import rsToastify from '../../../toast/toastify';
import { WebUtils } from '../../../../utils';

type MakeAllNever<T extends object> = { [K in keyof T]: never };

type ConditionalSearchProps =
	| ({ noSearch: true } & MakeAllNever<TableSearchProps>)
	| ({ noSearch?: false } & TableSearchProps);

export type PaginationTableProps<T extends object = Record<string, any>> = {
	/* ~~~~~~ Required ~~~~~~ */

	/** Called each time the table needs data.
	 * While fetching data the table will show a loading indicator
	 * @param {PageQuery} pageQuery
	 * @returns {Promise<T[]> | T[]} the data to display in the table */
	onGetData: (pageQuery: PageQuery) => Promise<T[]> | T[];
	/** The total number of rows possible in the table.
	 * Used to calculate the number of pages for the pagination display */
	total: number | (() => Promise<number>);

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the table, will always contain 'rsPaginationTable' */
	className?: string;
	/** The id of the table */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The number of rows to show each page @default 25 */
	perPage?: number;
	/** The current page number @default 1 */
	page?: number;
	/** Called when the page number changes
	 * @param {number} page The new page number. */
	onPageChange?: (page: number) => void;
	/** Called when the user changes the number of rows displayed each page
	 * @param {number} perPage The new number of rows per page. */
	onPerPageChange?: (perPage: number) => void;
	/** The field to sort by @default '' */
	sortField?: keyof T;
	/** The order to sort by @default 'NONE' */
	sortOrder?: StandardOrderTypes;
} & ConditionalSearchProps &
	Omit<StaticTableProps, 'data'>;

const PaginationTable: React.FC<PaginationTableProps> = (props) => {
	const {
		sortOrder = 'NONE',
		sortField = '',
		perPage = 25,
		page = 1,
		className,
		noSearch,
		total,
		id,
		onPerPageChange,
		onPageChange,
		onGetData,
		...searchAndStaticTableProps
	} = props;

	// TODO: Find out more how to set up search
	const [searchValue, setSearchValue] = useState<string | undefined>();
	const [tableData, setTableData] = useState<any[]>([]);
	const [isGettingData, setIsGettingData] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState<number>(perPage);
	const [currentPage, setCurrentPage] = useState<number>(page);
	const [totalRows, setTotalRows] = useState<number>(0);

	const totalPages = Math.ceil(totalRows / rowsPerPage);

	const getData = React.useCallback(async () => {
		if (currentPage > totalPages) return;

		setIsGettingData(true);

		try {
			setTableData([]);
			const pagination: PageQuery['pagination'] = { page: currentPage, perPage: rowsPerPage };
			const sort: PageQuery['sort'] = { field: sortField?.toString(), order: sortOrder };
			const filter: PageQuery['filter'] = {
				matchType: 'exact',
				searchTerm: [
					{
						column: '',
						value: ''
					}
				]
			};

			const data = await onGetData({ pagination, sort, filter });
			setTableData(data);
		} catch (e) {
			rsToastify.error(WebUtils.getAxiosErrorMessage(e), 'Error getting table data');
			console.error(e);
		}

		setIsGettingData(false);
	}, [onGetData, currentPage, rowsPerPage, sortField, sortOrder, totalPages]);

	const getTotalRows = React.useCallback(async () => {
		try {
			if (typeof total === 'number') return setTotalRows(total);
			const totalRows = await total();
			setTotalRows(totalRows);
		} catch (e) {
			rsToastify.error(WebUtils.getAxiosErrorMessage(e), 'Error getting total rows');
			console.error(e);
		}
	}, [total]);

	useEffect(() => {
		getData().catch(console.error);
	}, [getData]);

	useEffect(() => {
		getTotalRows().catch(console.error);
	}, [getTotalRows]);

	function handleTableSearch(value: string) {
		if (!!searchAndStaticTableProps.onSearch) searchAndStaticTableProps.onSearch(value);
		setSearchValue(value);
	}

	function handlePerPageChange(perPage: number) {
		setRowsPerPage(perPage);
		if (!!onPerPageChange) onPerPageChange(perPage);
	}

	function handlePageChange(page: number) {
		setCurrentPage(page);
		if (!!onPageChange) onPageChange(page);
	}

	function getClassName() {
		const classes = ['rsPaginationTable'];
		if (!!className) classes.push(className);
		if (!!noSearch) classes.push('noSearch');
		if (!!isGettingData) classes.push('loading');

		return classes.join(' ');
	}

	function renderSearch() {
		if (!!noSearch) return null;

		return (
			<TableSearch {...searchAndStaticTableProps} onSearch={handleTableSearch} id={id && `${id}TableSearch`} />
		);
	}

	function renderFooter() {
		return (
			<div className="paginationTableFooter">
				{searchAndStaticTableProps.footerContent}
				<TablePagination
					id={id && `${id}Pagination`}
					onPerPageChange={handlePerPageChange}
					onPageChange={handlePageChange}
					currentPageNumber={currentPage}
					rowsPerPage={rowsPerPage}
					total={totalRows}
				/>
			</div>
		);
	}

	return (
		<div className={getClassName()} id={id}>
			{renderSearch()}
			<StaticTable
				{...searchAndStaticTableProps}
				footerContent={renderFooter()}
				isLoading={isGettingData}
				id={id && `${id}Table`}
				data={tableData}
			/>
		</div>
	);
};

export default PaginationTable;
