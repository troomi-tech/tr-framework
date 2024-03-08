import React from 'react';

import './TableBody.scss';

export interface TableBodyProps {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name that will be applied to the tbody. Will always contain 'rsTableBody'. */
	className?: string;
	/** The id that will be applied to the tbody. */
	id?: string;
	/** The content to display in the tbody */
	children: React.ReactNode;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether or not the filter is shown. @default false */
	isFilterShown?: boolean;
}

const TableBody: React.FC<TableBodyProps> = (props) => {
	const { isFilterShown = false, className, id } = props;

	function getClassName() {
		const classes = ['rsTableBody'];
		if (!!isFilterShown) classes.push('rsTableBody--filterShown');
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	return (
		<tbody className={getClassName()} id={id}>
			{props.children}
		</tbody>
	);
};

export default TableBody;
