import React, { useEffect, useState } from 'react';
import './TablePagination.scss';
import PerPageDropdown, { PerPageDropdownProps } from './perPageDropdown/PerPageDropdown';
import Label from '../../../label/Label';
import Icon from '../../../icon/Icon';
import Button from '../../../button/Button';

export interface TablePaginationProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The total number of rows in the table. */
	total: number;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the component. Will always contain 'rsTablePagination'. */
	className?: string;
	/** The id of the component. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The current page number. @default 1 */
	currentPageNumber?: number;
	/** The options that will be passed to the PerPageDropdown. @default [5,10,25,50,100] */
	rowsPerPageOptions?: number[];
	/** The number of rows per page. @default 10 */
	rowsPerPage?: number;
	/** The properties that will be passed to the PerPageDropdown. */
	perPageDropdownProperties?: Pick<PerPageDropdownProps, 'canCreateOptions' | 'maximumValue' | 'onCreateOption'>;
	/** Called when the page number changes
	 * @param {number} page The new page number. */
	onPageChange?: (page: number) => void;
	/** Called when the user changes the number of rows displayed each page
	 * @param {number} perPage The new number of rows per page. */
	onPerPageChange?: (perPage: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = (props) => {
	const {
		rowsPerPage = 10,
		rowsPerPageOptions = getDefaultRowsPerPageOptions(),
		currentPageNumber = 1,
		perPageDropdownProperties,
		className,
		total,
		id,
		onPerPageChange,
		onPageChange
	} = props;

	const [selectedPage, setSelectedPage] = useState(currentPageNumber);
	const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(rowsPerPage);

	const totalAvailablePages = Math.ceil(total / selectedRowsPerPage);

	useEffect(() => {
		setSelectedPage(currentPageNumber);
	}, [currentPageNumber]);

	useEffect(() => {
		setSelectedRowsPerPage(rowsPerPage);
	}, [rowsPerPage]);

	function getDefaultRowsPerPageOptions() {
		const defaultRowsPerPageOptions = [5, 10, 25, 50, 100];
		if (!defaultRowsPerPageOptions.includes(rowsPerPage)) defaultRowsPerPageOptions.push(rowsPerPage);

		return defaultRowsPerPageOptions.sort((a, b) => a - b);
	}

	function getClassName() {
		const classes = ['rsTablePagination'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function getPageNumbersInView() {
		const pagesKnobs = Array.from({ length: 5 }, (_, i) => selectedPage + i - 2);
		const highestPage = Math.max(...pagesKnobs);
		const lowestPage = Math.min(...pagesKnobs);

		let offset = 0;
		if (highestPage > totalAvailablePages - 1) offset = totalAvailablePages - 1 - highestPage;
		else if (lowestPage < 2) offset = 2 - lowestPage;

		const offsetKnobs = pagesKnobs.map((page) => page + offset);

		return offsetKnobs;
	}

	function getPageNumbersWithEllipses(): (number | string)[] {
		if (totalAvailablePages <= 7) return Array.from({ length: totalAvailablePages }, (_, i) => i + 1);

		const pageNumbersInView = [1, ...getPageNumbersInView(), totalAvailablePages];
		const pagesWithEllipses = [];

		pagesWithEllipses.push(1);

		for (let i = 1; i < pageNumbersInView.length - 1; i++) {
			if (pageNumbersInView[i] - pageNumbersInView[i - 1] > 1) pagesWithEllipses.push('...');
			else if (pageNumbersInView[i + 1] - pageNumbersInView[i] > 1) pagesWithEllipses.push('...');
			else pagesWithEllipses.push(pageNumbersInView[i]);
		}

		pagesWithEllipses.push(totalAvailablePages);

		return pagesWithEllipses;
	}

	function changePageBy(amount: number) {
		const newPage = selectedPage + amount;
		if (newPage < 1 || newPage > totalAvailablePages) return;

		setSelectedPage(newPage);
		if (!!onPageChange) onPageChange(newPage);
	}

	function handlePerPageChange(value: number) {
		setSelectedRowsPerPage(value);
		setSelectedPage(1);
		if (!!onPerPageChange) onPerPageChange?.(value);
		if (!!onPageChange) onPageChange(1);
	}

	function handleDisplayNumberClick(page: number | string) {
		if (typeof page === 'number') {
			setSelectedPage(page);
			if (!!onPageChange) onPageChange(page);
		}
	}

	function renderIndex() {
		const firstRow = (selectedPage - 1) * selectedRowsPerPage + 1;
		const lastRow = Math.min(selectedPage * selectedRowsPerPage, total);

		return (
			<div className="index">
				<Label>
					{firstRow}-{lastRow} of {total}
				</Label>
			</div>
		);
	}

	function renderChevronLeft() {
		const isDisabled = selectedPage - 1 < 1;
		const classes = ['chevronSelect', 'left'];
		if (!!isDisabled) classes.push('disabled');

		return (
			<Button
				id={id ? `${id}LeftChevronIcon` : undefined}
				onClick={() => changePageBy(-1)}
				className={classes.join(' ')}
				disabled={isDisabled}
				look="none"
			>
				<Icon iconImg="icon-chevron-left" />
			</Button>
		);
	}

	function renderChevronRight() {
		const isDisabled = selectedPage + 1 > totalAvailablePages;
		const classes = ['chevronSelect', 'right'];
		if (!!isDisabled) classes.push('disabled');

		return (
			<Button
				id={id ? `${id}RightChevronIcon` : undefined}
				onClick={() => changePageBy(1)}
				className={classes.join(' ')}
				disabled={isDisabled}
				look="none"
			>
				<Icon iconImg="icon-chevron-right" />
			</Button>
		);
	}

	function handleCreateOption(value: string) {
		const newPerPage = Number(value);
		if (!!onPerPageChange) onPerPageChange(newPerPage);
		console.log('create option', newPerPage);

		setSelectedRowsPerPage(newPerPage);
	}

	function renderNumberDisplay() {
		const pages = getPageNumbersWithEllipses();
		return pages.map((page, i) => {
			const isEllipsis = page === '...';
			const classes = ['pageNumberSelector'];
			if (isEllipsis) classes.push('ellipsis');
			if (page === selectedPage) classes.push('selected');

			if (isEllipsis)
				return (
					<Label key={`${page}${i}`} className={classes.join(' ')}>
						{page}
					</Label>
				);

			return (
				<Button
					key={`${page}${i}`}
					onClick={() => handleDisplayNumberClick(page)}
					className={classes.join(' ')}
					look="none"
				>
					{page}
				</Button>
			);
		});
	}

	return (
		<div id={id} className={getClassName()}>
			<div className="rowsPerPage">
				<Label className="rowsPerPageLabel">Rows per page:</Label>
				<PerPageDropdown
					{...perPageDropdownProperties}
					onChange={handlePerPageChange}
					onCreateOption={handleCreateOption}
					perPageOptions={rowsPerPageOptions}
					selectedOption={selectedRowsPerPage}
				/>
			</div>
			{renderIndex()}
			<div className="pageNavigationContainer">
				{renderChevronLeft()}
				{renderNumberDisplay()}
				{renderChevronRight()}
			</div>
		</div>
	);
};

export default TablePagination;
