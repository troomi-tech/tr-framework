import React from 'react';
import './TableSearch.scss';
import TextInput from '../../../input/controls/textInput/TextInput';
import { debounce } from 'lodash';
import { OptionType } from '../../../input/controls/select/Select';
import { useFormControl } from '../../../../hooks';
import FormControl from '../../../../form/FormControl';

export interface TableSearchProps {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the component. Will always contain 'rsTableSearch'. */
	className?: string;
	/** The id of the component. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The function that will be called when the search value changes.
	 * @param {string} value  The value of the search input. */
	onSearch?: (value: string) => void;
	/** The function that will be called when the filter value changes.
	 * @param {string} value The value of the filter input. */
	onFilterChange?: (value: string) => void;
	/** The options that will be used for the filter dropdown. */
	filterOptions?: OptionType[];
	/** The initial value of the search input. @default '' */
	initialSearchValue?: string;
	/** The initial value of the filter input. @default '' */
	searchPlaceholder?: string;
	/** The delay in milliseconds that the search will wait
	 * before calling the onSearch function. @default 500 */
	searchDebounceDelay?: number;
}

const TableSearch: React.FC<TableSearchProps> = (props) => {
	const {
		onSearch = () => {},
		searchPlaceholder = 'Search',
		searchDebounceDelay = 500,
		initialSearchValue = '',
		className,
		id
	} = props;

	const [searchControl, updateFormControl] = useFormControl(initialSearchValue);
	const debounceRef = React.useRef(debounce(onSearch, searchDebounceDelay));

	function getClassName() {
		const classes = ['rsTableSearch'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function handleControlUpdate(control: FormControl) {
		debounceRef.current(control.value.toString());
		updateFormControl(control);
	}

	return (
		<div id={id} className={getClassName()}>
			<TextInput
				type="text"
				look="underline"
				control={searchControl}
				id={id && `${id}Input`}
				placeholder={searchPlaceholder}
				onControlUpdate={handleControlUpdate}
			/>
			{/* <Button
				className={'rsFilterColumn'}
				look={filterOption ? 'outlinedSecondary' : 'none'}
				onClick={() => {
					enableColumnFilters();
					setFilterOption(!filterOption);
				}}
			>
				<Icon className={'filterIcon'} iconImg={'icon-filter'} size={19} />

				<Label>Filters</Label>
			</Button> */}
		</div>
	);
};

export default TableSearch;
