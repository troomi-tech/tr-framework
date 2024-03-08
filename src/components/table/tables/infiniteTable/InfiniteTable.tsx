import React, { useEffect, useState } from 'react';
import './InfiniteTable.scss';
import TableSearch, { TableSearchProps } from '../../tablePieces/tableSearch/TableSearch';
import useIntersectionObserver from '../../../../hooks/useIntersectionObserver';
import { PageQuery, StandardOrderTypes } from '../../PageQuery';
import Button from '../../../button/Button';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import StaticTable, { StaticTableProps } from '../StaticTable';
import rsToastify from '../../../toast/toastify';
import { WebUtils } from '../../../../utils';

type MakeAllNever<T extends object> = { [K in keyof T]: never };

type ConditionalSearchProps =
	| ({ noSearch: true } & MakeAllNever<TableSearchProps>)
	| ({ noSearch?: false } & TableSearchProps);

export type InfiniteTableProps<T extends object = Record<string, any>> = {
	/* ~~~~~~ Required ~~~~~~ */

	/** Called each time the the bottom of the table is reached or
	 * when the user clicks the load more button.
	 * While fetching data the table will show a loading indicator
	 * @param {PageQuery} pageQuery
	 * @returns {Promise<T[]> | T[]} the data to display in the table */
	onGetData: (pageQuery: PageQuery) => Promise<T[]> | T[];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the table, will always contain 'rsInfiniteTable' */
	className?: string;
	/** The id of the table */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The total number of rows possible in the table.
	 * takes either a integer or `auto`.
	 * If `auto` is passed the table will continue to load data until the
	 * onGetData function returns less than the perPage amount of data
	 * @default 'auto' */
	total?: number | 'auto';
	/** The number of rows to show each page @default 25 */
	perPage?: number;
	/** The field to sort by @default '' */
	sortField?: keyof T;
	/** The order to sort by @default 'NONE' */
	sortOrder?: StandardOrderTypes;
	/** The component to render at the bottom of the table while loading more data @default 'Loading...' */
	infiniteLoadingComponent?: React.ReactNode;
	/** Whether or not to show the load more button.
	 * The load more button will be disabled if the number rows reaches `total`
	 * @default true */
	showLoadMoreButton?: boolean;
	/** Whether or not to show the number of results at the bottom of the table.
	 * If `total` is set to `auto` the number of results will not show the total possible rows
	 * @default true */
	showNumberOfResults?: boolean;
	/** Called when the user clicks the load more button, or when the bottom of the table is reached */
	onLoadMore?: () => void;
} & ConditionalSearchProps &
	Omit<StaticTableProps, 'data'>;

const InfiniteTable: React.FC<InfiniteTableProps> = (props) => {
	const {
		infiniteLoadingComponent = 'Loading...',
		showNumberOfResults = true,
		showLoadMoreButton = true,
		sortOrder = 'NONE',
		sortField = '',
		total = 'auto',
		perPage = 25,
		className,
		id,
		onGetData,
		onLoadMore,
		noSearch,
		...searchAndStaticTableProps
	} = props;

	// TODO: Find out more how to set up search
	const [searchValue, setSearchValue] = React.useState<string | undefined>();
	const [tableData, setTableData] = React.useState<any[]>([]);
	const [isGettingData, setIsGettingData] = useState(false);
	const infiniteLoadingRef = React.useRef<HTMLDivElement>(null);
	const isInfiniteLoadingRefInView = useIntersectionObserver(infiniteLoadingRef);
	const totalPages = React.useRef<number>(0);
	const [page, setPage] = React.useState<number>(0);

	const isAutoTotal = total === 'auto';

	const getData = React.useCallback(async () => {
		if (page >= totalPages.current) return;

		setIsGettingData(true);

		try {
			const pagination: PageQuery['pagination'] = { page, perPage };
			const sort: PageQuery['sort'] = { field: sortField?.toString(), order: sortOrder };
			const filter: PageQuery['filter'] = {
				matchType: 'exact',
				searchTerm: [{ column: '', value: '' }]
			};

			const data = await onGetData({ pagination, sort, filter });
			// If the data is less than the perPage amount then we know we have reached the end of the table
			if (isAutoTotal && data.length < perPage) totalPages.current = page - 1;

			setTableData((prev) => {
				if (page === 1) return data;
				return [...prev, ...data];
			});
		} catch (e) {
			rsToastify.error(WebUtils.getAxiosErrorMessage(e), 'Error getting table data');
			console.error(e);
		}

		setIsGettingData(false);
	}, [onGetData, page, perPage, sortField, sortOrder, isAutoTotal]);

	useEffect(() => {
		getData().catch(console.error);
	}, [getData]);

	useEffect(() => {
		if (!isAutoTotal) totalPages.current = Math.ceil(total / perPage);
		else if (totalPages.current < 1) totalPages.current = Infinity;
	}, [isAutoTotal, total, perPage]);

	useEffect(() => {
		if (!isInfiniteLoadingRefInView) return;
		if (!!onLoadMore) onLoadMore();

		setPage((prevPage) => {
			if (prevPage >= totalPages.current) return prevPage;
			return prevPage + 1;
		});
	}, [isInfiniteLoadingRefInView, onLoadMore]);

	function getClassName() {
		const classes = ['rsInfiniteTable'];
		if (!!className) classes.push(className);
		if (!!noSearch) classes.push('noSearch');
		if (!!isGettingData) classes.push('isGettingData');

		return classes.join(' ');
	}

	function handleTableSearch(value: string) {
		if (!!searchAndStaticTableProps.onSearch) searchAndStaticTableProps.onSearch(value);
		setSearchValue(value);
	}

	function renderNumberOfResults() {
		if (!showNumberOfResults) return null;
		const tableLength = tableData.length;
		const totalRows = Math.max(totalPages.current * perPage, tableLength);
		const totalLabel = totalRows === Infinity ? `${tableLength}` : `${tableLength} of ${totalRows}`;

		return (
			<Label variant="body2" className="numberOfResults">
				{totalLabel} Results
			</Label>
		);
	}

	function renderLoadMoreButton() {
		if (!showLoadMoreButton) return null;
		const isButtonDisabled = page >= totalPages.current;

		return (
			<Button
				onClick={() => setPage((prev) => prev + 1)}
				className="loadMoreButton"
				id={id && `${id}LoadMoreButton`}
				disabled={isButtonDisabled}
				look="textPrimary"
				small
			>
				Load More
			</Button>
		);
	}

	function renderSearch() {
		if (!!noSearch) return null;

		return (
			<TableSearch {...searchAndStaticTableProps} id={id && `${id}TableSearch`} onSearch={handleTableSearch} />
		);
	}

	function renderFooter() {
		return (
			<div className="infTableFooter">
				{searchAndStaticTableProps.footerContent}
				<Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
					<Box>{renderNumberOfResults()}</Box>
					<Box>{renderLoadMoreButton()}</Box>
				</Box>
				<div ref={infiniteLoadingRef} />
				{isGettingData && infiniteLoadingComponent}
			</div>
		);
	}

	return (
		<div className={getClassName()} id={id}>
			{renderSearch()}
			<StaticTable
				{...searchAndStaticTableProps}
				footerContent={renderFooter()}
				id={id && `${id}StaticTable`}
				data={tableData}
			/>
		</div>
	);
};

export default InfiniteTable;
