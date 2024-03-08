import React, { CSSProperties, useEffect, useState } from 'react';
import './Select.scss';
import ReactSelect, { SelectComponentsConfig, StylesConfig } from 'react-select';
import { ActionMeta, GroupTypeBase, OptionsType, Theme, ValueType } from 'react-select/src/types';
import Box from '../../../box/Box';
import Creatable from 'react-select/creatable';
import { TROOMI_COLORS } from '../../../../utils/constants';
import { ObjectUtils } from '../../../../utils';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { RequiredValidator } from '../../../../form/Validators';
import { TypingUtils } from '../../../../utils/TypingUtils';
import { InputControlProps } from '../../input.types';
import useInputControl from '../../../../hooks/useInputControl';

export type SelectControlValues = null | undefined | string | number | (string | number)[];

export type OptionType<V = string | number, L = string | number> = {
	value: V;
	label: L;
};

export type GroupType = {
	label: string;
	options: OptionType[];
};

export type IsMulti = boolean;
export type ReactSelectProps = ReactSelect['props'];
export type ReactCreatableProps = Creatable<OptionType, IsMulti>['props'];

type ConditionalCreatableProps =
	| ({ isCreatable: true } & SelectCreatableProps)
	| ({ isCreatable?: false } & TypingUtils.MakeAllNever<SelectCreatableProps>);

/** NOTE: `SelectShared` is a Type not a Interface */
export type SelectSharedProps = InputControlProps<SelectControlValues> & {
	/* ~~~~~~ Required ~~~~~~ */

	/** Array of options that populate the Select menu
	 * Can take any of the following
	 * an array of { value, label } objects
	 * an array of options grouped by a label property on each of the options
	 * a single record of { [key: string]: number | string } where the label is the key and the value is the value
	 * an array of strings or numbers where the value and label are the same.
	 * All data types will be converted to { value, label } objects */
	options: OptionType[] | GroupType[] | Record<string, string | number> | (string | number)[];

	/* ~~~~~~ Custom ~~~~~~ */

	/** The theme to use for the Select */
	theme?: 'none' | 'rsInput';
	/** Handle what happens when the clear button is pressed */
	onFormClear?: () => void;

	/* ~~~~~~ Container ~~~~~~ */

	/** className attribute applied to the wrapper around the `react-select` component.
	 * Will always contain `rsSelect` and `rsInput`. */
	className?: string;
	/** The id to set on the SelectContainer component */
	id?: string;
	/** Width of the SelectContainer component */
	width?: string | number;
	/** Additional CSS styles to apply to the SelectContainer component */
	style?: CSSProperties;

	/* ~~~~~~ Select ~~~~~~ */

	/** Close the Select menu when the user selects an option */
	closeMenuOnSelect?: ReactSelectProps['closeMenuOnSelect'];
	/** Is the Select value clearable */
	isClearable?: ReactSelectProps['isClearable'];
	/** Is the Select disabled */
	isDisabled?: ReactSelectProps['isDisabled'];
	/** Is the Select in a state of loading (async) */
	isLoading?: ReactSelectProps['isLoading'];
	/** Support multiple selected options */
	isMulti?: boolean; // NOTE: This is specifically set to boolean because react-selects type is badly typed
	/** Complex object used to override the looks and functionality of the selected options inside the input section */
	components?: SelectComponentsConfig<OptionType, IsMulti>; // NOTE: This isn't ReactSelectProps['components'] because is creatable is conditionally added
	/** Is the Select direction right-to-left */
	isRtl?: ReactSelectProps['isRtl'];
	/** Whether to enable search functionality */
	isSearchable?: ReactSelectProps['isSearchable'];
	/** Async: Text to display when loading options */
	loadingMessage?: ReactSelectProps['loadingMessage'];
	/** Minimum height of the menu before flipping */
	minMenuHeight?: ReactSelectProps['minMenuHeight'];
	/** Maximum height of the menu before scrolling */
	maxMenuHeight?: ReactSelectProps['maxMenuHeight'];
	/** Whether the menu is open */
	menuIsOpen?: ReactSelectProps['menuIsOpen'];
	/** Default placement of the menu in relation to the control. 'auto' will flip
	 * when there isn't enough space below the control. */
	menuPlacement?: ReactSelectProps['menuPlacement'];
	/** The CSS position value of the menu, when "fixed" extra layout management is required */
	menuPosition?: ReactSelectProps['menuPosition'];
	/** Text to display when there are no options */
	noOptionsMessage?: ReactSelectProps['noOptionsMessage'];
	/** Handle blur events on the control */
	onBlur?: ReactSelectProps['onBlur'];
	/** Handle focus events on the control */
	onFocus?: ReactSelectProps['onFocus'];
	/** Handle change events on the input */
	onInputChange?: ReactSelectProps['onInputChange'];
	/** Handle the menu opening */
	onMenuOpen?: ReactSelectProps['onMenuOpen'];
	/** Handle the menu closing */
	onMenuClose?: ReactSelectProps['onMenuClose'];
	/** Allows control of whether the menu is opened when the Select is focused */
	openMenuOnFocus?: ReactSelectProps['openMenuOnFocus'];
	/** Allows control of whether the menu is opened when the Select is clicked */
	openMenuOnClick?: ReactSelectProps['openMenuOnClick'];
	/** Number of options to jump in menu when page{up|down} keys are used */
	pageSize?: ReactSelectProps['pageSize'];
	/** Placeholder text for the Select value */
	placeholder?: ReactSelectProps['placeholder'];
	/** Style modifier methods */
	styles?: StylesConfig<OptionType, IsMulti>;
	/** Sets the tabIndex attribute on the input */
	tabIndex?: ReactSelectProps['tabIndex'];
	/** Select the currently focused option when the user presses tab */
	tabSelectsValue?: ReactSelectProps['tabSelectsValue'];
};

/** NOTE: `SelectCreatableProps` is an Type not a Interface */
export type SelectCreatableProps = {
	/* ~~~~~~ Creatable ~~~~~~ */

	/** Allow options to be created while the `isLoading` prop is true. Useful to
	 * prevent the "create new ..." option being displayed while async results are
	 * still being loaded. */
	allowCreateWhileLoading?: ReactCreatableProps['allowCreateWhileLoading'];
	/** Sets the position of the createOption element in your options list. Defaults to 'last' */
	createOptionPosition?: ReactCreatableProps['createOptionPosition'];
	/** Gets the label for the "create new ..." option in the menu. Is given the
	 * current input value. */
	formatCreateLabel?: ReactCreatableProps['formatCreateLabel'];
	/** Determines whether the "create new ..." option should be displayed based on
	 * the current input value, select value and options array. */
	isValidNewOption?: ReactCreatableProps['isValidNewOption'];
	/** Returns the data for the new option when it is created. Used to display the
	 * value, and is passed to `onChange`. */
	getNewOptionData?: ReactCreatableProps['getNewOptionData'];

	/* ~~~~~~ Custom ~~~~~~ */

	/** Called when the user clicks on the create new option.
	 * @param {string} inputValue The value inputted for creating a new option
	 * @returns {OptionType | undefined | void} The new option to add.
	 * If undefined is returned, the option will be added as is */
	onCreateOption?: (inputValue: string) => OptionType | undefined | void;
};

export type SelectProps = SelectSharedProps & ConditionalCreatableProps;

const Select: React.FC<SelectProps> = (props) => {
	const [control, updateControl] = useInputControl<SelectControlValues>(props);
	const { isCreatable, className, width, theme, id, onFormClear, ...selectProps } = props;
	const { styles, options, isMulti } = selectProps;

	const [value, setValue] = useState<ValueType<OptionType, IsMulti>>();
	const [createdOptions, setCreatedOptions] = useState<OptionType[]>([]);

	const isRequired = control.has(RequiredValidator);
	const isInvalid = !control.isValid;

	const optionArray: OptionType[] = React.useMemo(() => {
		const newOptionsArray: OptionType[] = [];

		const isArray = Array.isArray(options);
		const isGroupOptions = getIsGroupOption(options);

		if (isArray && isGroupOptions) options.forEach((group) => newOptionsArray.push(...group.options));
		if (!isArray) newOptionsArray.push(...Object.entries(options).map(([label, value]) => ({ value, label })));
		if (isArray && !isGroupOptions)
			options.forEach((option) => {
				if (typeof option === 'object') newOptionsArray.push(option);
				else newOptionsArray.push({ value: option, label: option });
			});

		return [...newOptionsArray, ...createdOptions];
	}, [options, createdOptions]);

	useEffect(() => {
		if (!ObjectUtils.isArrayWithData(optionArray)) return;

		const controlValue = control.value;
		if (String(controlValue).length <= 0) return;

		if (typeof controlValue === 'number' || typeof controlValue === 'string') {
			setValue(optionArray.filter((item) => item.value.toString() === controlValue.toString()));
		} else if (Array.isArray(controlValue)) {
			let defaultOptions: OptionType[] = [];
			controlValue.forEach((item: string | number) => {
				const filteredOptions = optionArray.filter((option) => item === option.value);
				defaultOptions = [...defaultOptions, ...filteredOptions];
			});
			setValue(defaultOptions);
		}
	}, [control, optionArray]);

	function getClassName() {
		const classes = ['rsSelect'];
		if (!!className) classes.push(`${className}`);
		if (!!isInvalid) classes.push(`error`);
		if (!!theme && theme !== 'none') classes.push(`theme-${theme}`);

		return classes.join(' ');
	}

	function getIsGroupOption(options: SelectProps['options']): options is GroupType[] {
		if (!Array.isArray(options)) return false;
		const hasOptionsProperty = Object.prototype.hasOwnProperty.call(options[0], 'options');
		return hasOptionsProperty;
	}

	async function handleChange(value: OptionsType<OptionType> | OptionType | null, action: ActionMeta<OptionType>) {
		let updatedValue: SelectControlValues = '';

		if (Array.isArray(value)) {
			updatedValue = value.map((item) => item.value);
			if (updatedValue.length === 0) updatedValue = isMulti ? [] : '';
		} else if (value === null) {
			updatedValue = isMulti ? [] : '';
		} else if ('value' in value) {
			updatedValue = value.value;
		}

		if (action.action === 'clear' && onFormClear) onFormClear();

		updateControl((prev) => {
			prev.value = updatedValue;
			return prev;
		});

		setValue(value);
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!width) styles.width = width;

		return styles;
	}

	function getSelectTheme(providedTheme: Theme) {
		const rsInputTheme: Theme = {
			...providedTheme,
			borderRadius: 0,
			colors: {
				...providedTheme.colors,
				primary25: TROOMI_COLORS.$lightGray,
				primary: TROOMI_COLORS.$primaryPurpleColor
			}
		};

		switch (theme) {
			case 'rsInput':
				return rsInputTheme;
			case 'none':
			default:
				return providedTheme;
		}
	}

	function getSelectStyles() {
		const rsInputStyles: StylesConfig<OptionType, IsMulti> = {
			...styles,
			control: (providedStyle) => ({
				...providedStyle,
				minHeight: '30px'
			}),
			option: (providedStyle, optionState) => ({
				...providedStyle,
				backgroundColor: optionState.isSelected ? TROOMI_COLORS.$primaryPurpleColor : TROOMI_COLORS.$white,
				color: optionState.isSelected ? TROOMI_COLORS.$white : TROOMI_COLORS.$primaryTextColor,
				fontWeight: optionState.isFocused ? 'bold' : 'normal',
				opacity: optionState.isDisabled ? 0.5 : 1
			})
		};

		switch (theme) {
			case 'rsInput':
				return rsInputStyles;
			case 'none':
			default:
				return;
		}
	}

	function handleCreateOption(inputValue: string) {
		const areOptionValuesNumbers = optionArray.every((option) => typeof option.value === 'number');
		const outputtedOption = selectProps.onCreateOption?.(inputValue);
		const newOption = outputtedOption ?? {
			value: areOptionValuesNumbers ? +inputValue : inputValue,
			label: inputValue
		};

		const doesOptionArrayContainNewOption = optionArray.some((option) => option.value === newOption.value);
		if (doesOptionArrayContainNewOption) return;

		updateControl((prev) => {
			if (isMulti) {
				const newControlValue = Array.isArray(prev.value) ? prev.value : [];
				prev.value = [...newControlValue, newOption.value];
				return prev;
			}

			prev.value = newOption.value;
			return prev;
		});

		setCreatedOptions((prev) => [...prev, newOption]);
	}

	function handleIsValidNewOption(
		inputValue: string,
		value: OptionType | OptionsType<OptionType> | null,
		options: readonly (OptionType | GroupTypeBase<OptionType>)[]
	): boolean {
		const areOptionValuesNumbers = optionArray.every((option) => typeof option.value === 'number');
		const parsedInputValue = areOptionValuesNumbers ? +inputValue : inputValue;
		const doesOptionArrayContainNewOption = optionArray.some((option) => option.value === parsedInputValue);
		let isValid = !doesOptionArrayContainNewOption;
		if (!!selectProps.isValidNewOption) isValid &&= selectProps.isValidNewOption(inputValue, value, options);
		return isValid;
	}

	function handleBlur() {
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	function renderCreatableSelect() {
		return (
			<Creatable
				{...selectProps}
				value={value}
				options={optionArray}
				onCreateOption={handleCreateOption}
				isValidNewOption={handleIsValidNewOption}
				styles={getSelectStyles()}
				onChange={handleChange}
				theme={getSelectTheme}
				onBlur={handleBlur}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
			/>
		);
	}

	function renderBasicSelect() {
		return (
			<ReactSelect
				{...selectProps}
				value={value}
				options={optionArray}
				styles={getSelectStyles()}
				onChange={handleChange}
				theme={getSelectTheme}
				onBlur={handleBlur}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
			/>
		);
	}

	return (
		<>
			<Box className={getClassName()} style={getStyle()} id={id}>
				{isCreatable ? renderCreatableSelect() : renderBasicSelect()}
			</Box>
			<ErrorMessage control={control} />
		</>
	);
};

export default Select;
