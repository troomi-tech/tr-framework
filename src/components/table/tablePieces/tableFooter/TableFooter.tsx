import React from 'react';
import './TableFooter.scss';

export interface TableFooterProps extends React.PropsWithChildren {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name that will be applied to the tfoot. Will always contain 'rsTableFooter'. */
	className?: string;
	/** The id that will be applied to the tfoot. */
	id?: string;
}

const TableFooter: React.FC<TableFooterProps> = (props) => {
	const { className, id } = props;

	function getClassName() {
		const classes = ['rsTableFooter'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	return (
		<tfoot className={getClassName()} id={id}>
			<tr>
				<th colSpan={500}>{props.children}</th>
			</tr>
		</tfoot>
	);
};

export default TableFooter;
