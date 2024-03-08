import React from 'react';
import './PerPageDropdown.scss';
import Select, { OptionType } from '../../../../input/controls/select/Select';
import { isInteger } from 'lodash';
import { ObjectUtils } from '../../../../../utils';
import { GroupTypeBase, OptionsType } from 'react-select';
import { Validators } from '../../../../../form';
import { useFormControl } from '../../../../../hooks';
import FormControl from '../../../../../form/FormControl';

export interface PerPageDropdownProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The Options that the user can select from. */
	perPageOptions: number[];
	/** The currently selected option. */
	selectedOption: number;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the component. Will always contain 'rsPerPageDropdown'. */
	className?: string;
	/** The id of the component. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether or not the user can add new options. @default true */
	canCreateOptions?: boolean;
	/** The maximum value that the user can enter. @default 999 */
	maximumValue?: number;
	/** Called when the user creates a new option.
	 * @param {string} value The value of the new option. */
	onCreateOption?: (value: string) => void;
	/** Called when the user changes the selected option.
	 * @param {number} value The value of the new option. */
	onChange?: (value: number) => void;
}

const PerPageDropdown: React.FC<PerPageDropdownProps> = (props) => {
	const {
		canCreateOptions = true,
		maximumValue = 999,
		perPageOptions,
		selectedOption,
		className,
		id,
		onCreateOption,
		onChange
	} = props;

	const [perPageControl, updatePerPageControl] = useFormControl(
		selectedOption,
		Validators.MIN_VALUE(0, 'Please enter a number greater than 0.'),
		Validators.MAX_VALUE(maximumValue, 'Please enter a number less than 1000.')
	);

	function handleControlUpdate(control: FormControl) {
		if (!!onChange) onChange(Number(control.value));
		updatePerPageControl(control);
	}

	function handleCreateOption(value: string) {
		if (!!onCreateOption) onCreateOption(value);
		const newControl = perPageControl.clone();
		newControl.value = Number(value);
		updatePerPageControl(newControl);
	}

	function getClassName() {
		const classes = ['rsPerPageDropdown'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function getSelectOptions(): OptionType[] {
		const filteredOptions = new Set(perPageOptions.sort((a, b) => a - b));

		return Array.from(filteredOptions).map((option) => ({ label: option.toString(), value: option }));
	}

	function handleIsValidNewOption(
		inputValue: string,
		value: OptionType | OptionsType<OptionType> | null,
		options: readonly (OptionType | GroupTypeBase<OptionType>)[]
	) {
		let isValid = true;
		if (ObjectUtils.isArrayWithData(options)) isValid &&= !options.find((option) => +option?.value === +inputValue);
		isValid &&= isInteger(+inputValue);
		isValid &&= canCreateOptions;
		isValid &&= +inputValue < maximumValue;
		isValid &&= +inputValue > 0;

		return isValid;
	}

	return (
		<div className={getClassName()} id={id}>
			<Select
				id={id && `${id}Select`}
				menuPlacement="auto"
				control={perPageControl}
				theme="rsInput"
				isValidNewOption={handleIsValidNewOption}
				onControlUpdate={handleControlUpdate}
				onCreateOption={handleCreateOption}
				options={getSelectOptions()}
				isCreatable
			/>
		</div>
	);
};

export default PerPageDropdown;
