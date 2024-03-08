import React, { CSSProperties } from 'react';
import './TableCell.scss';
import TextCell, { TextCellProps } from '../../tableCells/textCell/TextCell';
import CustomCell, { CustomCellProps } from '../../tableCells/customCell/CustomCell';
import DateCell, { DateCellProps } from '../../tableCells/dateCell/DateCell';
import ImageCell, { ImageCellProps } from '../../tableCells/imageCell/ImageCell';
import InputCell, { InputCellProps } from '../../tableCells/inputCell/InputCell';
import { BaseCellProps } from '../../tableCells/BaseCell';
import ButtonCell, { ButtonCellProps } from '../../tableCells/buttonCell/ButtonCell';
import { WebUtils } from '../../../../utils';

type ConditionalTableCellProps =
	| ({ cellType: 'text' } & Omit<TextCellProps, keyof BaseCellProps>)
	| ({ cellType: 'date' } & Omit<DateCellProps, keyof BaseCellProps>)
	| ({ cellType: 'button' } & Omit<ButtonCellProps, keyof BaseCellProps>)
	| ({ cellType: 'image' } & Omit<ImageCellProps, keyof BaseCellProps>)
	| ({ cellType: 'input' } & Omit<InputCellProps, keyof BaseCellProps>)
	| ({ cellType: 'custom' } & Omit<CustomCellProps, keyof BaseCellProps>);

export type TableCellDetails = {
	/* ~~~~~~ Required ~~~~~~ */

	/** The type of cell that will be rendered. @default 'text' */
	cellType: 'text' | 'date' | 'image' | 'input' | 'custom' | 'button';

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class of the cell. Will always contain 'rsTableCell'. */
	className?: string;
	/** The id that will be applied to the cell. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Called when the user clicks the cell
	 * @param {any} data The current value of the cell
	 * @param {number} columnIndex The index of the column that the cell is in
	 * @param {number} rowIndex The index of the row that the cell is in */
	onClick?: (data: any, columnIndex: number, rowIndex: number) => void;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The alignment of the cell. @default 'left' */
	align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
	/** The size of the cell. @default 'medium' */
	size?: 'small' | 'medium' | 'large';
	/** The style of the cell */
	style?: CSSProperties;
} & ConditionalTableCellProps;

export type TableCellProps = TableCellDetails & BaseCellProps;

const TableCell: React.FC<TableCellProps> = (props) => {
	// Does not destructure conditional props because it causes issues with the type system
	const { align = 'left', size = 'medium', style, className } = props;

	function getClassName() {
		const classes = ['rsTableCell'];

		if (!!className) classes.push(`${className}`);
		if (!!size) classes.push(size);
		if (!!props.onClick) classes.push('clickable');
		if (align === 'center') classes.push('centerAlign');
		else if (align === 'inherit') classes.push('inheritClass');
		else if (align === 'justify') classes.push('justifyClass');
		else if (align === 'left') classes.push('leftAlign');
		else if (align === 'right') classes.push('rightAlign');

		return classes.join(' ');
	}

	function renderTableCell() {
		const data = props.data;
		const stringifiedData = String(data);
		const elementData = WebUtils.parseToReactNode(data);
		if (!!props.isHeader) return <TextCell isHeader {...props} className={getClassName()} data={String(data)} />;

		const baseCellProps: Omit<BaseCellProps, 'data'> = {
			columnIndex: props.columnIndex,
			className: getClassName(),
			rowIndex: props.rowIndex,
			isHeader: props.isHeader,
			onClick: props.onClick,
			style: style,
			id: props.id
		};

		switch (props.cellType) {
			case 'text':
				return <TextCell {...props} {...baseCellProps} data={stringifiedData} />;
			case 'date':
				return <DateCell {...props} {...baseCellProps} data={stringifiedData} />;
			case 'button':
				return <ButtonCell {...props} {...baseCellProps} data={elementData} />;
			case 'image':
				return <ImageCell {...props} {...baseCellProps} data={stringifiedData} />;
			case 'input':
				return <InputCell {...props} {...baseCellProps} data={stringifiedData} />;
			case 'custom':
				return <CustomCell {...props} {...baseCellProps} data={elementData} />;
			default:
				return <TextCell {...baseCellProps} data={stringifiedData} />;
		}
	}

	return renderTableCell();
};

export default TableCell;
