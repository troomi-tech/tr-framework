import { TableCellDetails } from './tablePieces/tableCell/TableCell';

export type FieldName = string;
export interface TableSearchDetails {
	placeholder: string;
	filterQuery: {
		column: string;
		value: string | string[] | number | number[];
		conjunction?: 'AND' | 'OR';
	}[];
}

/** A column detail is a blueprint for a column in a table.
 * It must have a label and an accessor.
 * The accessor is a string that is used to access the data in the data object.
 * The accessor can be a nested object, for example: 'address.street'. */
export type ColumnDetail<T = Record<string, any>> = {
	/** The text that will be displayed in the table header. for example: 'Name' */
	label: string;
	/** The accessor is a string that is used to access the data in the data object.
	 * The accessor can be a nested object, for example: 'address.street'. */
	accessor: keyof T extends string ? keyof T | `${keyof T}.${string}` : string;
	/** TODO: find out what this does */
	filterType?: 'NORMAL' | 'SINGLE_DATE' | 'CHECKBOX' | 'MULTI_QUERY' | 'NONE';
	/** TODO: find out what this does */
	filterName?: 'createdOn' | 'startOn' | 'endOn';
	/** TODO: find out what this does */
	multiFilterQuery?: {
		column: string;
		value: string | string[] | number | number[];
		conjunction?: 'AND' | 'OR';
	}[];
} & TableCellDetails;
