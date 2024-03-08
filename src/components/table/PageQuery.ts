export type StandardOrderTypes = 'ASC' | 'DESC' | 'RAND' | 'NONE';
export type ConjunctionTypes = 'AND' | 'OR';
export type MatchTypes =
	| 'exact'
	| 'fuzzy'
	| 'like'
	| 'greaterThan'
	| 'greaterThanEqual'
	| 'lessThan'
	| 'lessThanEqual'
	| 'regExp';
export interface SortQuery {
	field: string;
	order: StandardOrderTypes;
}
export interface PagePagination {
	page: number;
	perPage: number;
}
export interface PageQuery {
	pagination: PagePagination;
	sort?: SortQuery;
	filter?: FilterQuery;
}
export interface FilterQuery {
	matchType: MatchTypes;
	searchTerm: FilterQueryValue[];
}
export interface FilterQueryValue {
	column: string;
	value: string | string[] | number | number[];
	conjunction?: ConjunctionTypes;
	matchType?: MatchTypes;
}
