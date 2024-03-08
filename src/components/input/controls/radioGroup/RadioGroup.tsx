import React, { CSSProperties } from 'react';
import './RadioGroup.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import * as Icomoon from '../../../../icomoon/types/Icomoon';
import { RequiredValidator } from '../../../../form/Validators';
import { InputControlProps } from '../../input.types';
import Label, { LabelProps } from '../../../label/Label';
import { TROOMI_COLORS } from '../../../../utils/constants';
import useInputControl from '../../../../hooks/useInputControl';

export type RadioGroupControlValues = string | number | undefined | null;

const NO_RADIO_GROUP_NAME_ERROR =
	'Troomi RadioGroup must have a name or id. If using a formGroup, this is handled automatically.';

const DEFAULT_RADIO_OPTIONS: Required<RadioOptions> = {
	iconImg: 'none',
	disabledIconImg: 'none',
	selectedIconImg: 'none',
	deselectedIconImg: 'none',
	textVariant: 'bodyList',
	iconSize: '16px',
	selectedRadioColor: TROOMI_COLORS.$primaryOrangeColor,
	deselectedRadioColor: TROOMI_COLORS.$primaryTextColor,
	labelColor: TROOMI_COLORS.$primaryTextColor
};

export type RadioOptions = {
	/** If an icon is provided the radio will no longer be a circle, but instead the icon.
	 * Other icon options will override this one. @default 'none' */
	iconImg?: `icon-${Icomoon.GlyphNames}` | 'none';
	/** The icon to use when the option is disabled @default 'none' */
	disabledIconImg?: `icon-${Icomoon.GlyphNames}` | 'none';
	/** The icon to use when the option is selected @default none */
	selectedIconImg?: `icon-${Icomoon.GlyphNames}` | 'none';
	/** The icon to use when the option is not selected @default none */
	deselectedIconImg?: `icon-${Icomoon.GlyphNames}` | 'none';
	/** The text variant of the label */
	textVariant?: LabelProps['variant'];
	/** The color of the radio when selected @default TROOMI_COLORS.$primaryOrangeColor */
	selectedRadioColor?: CSSProperties['color'];
	/** The color of the radio when not selected @default TROOMI_COLORS.$primaryTextColor */
	deselectedRadioColor?: CSSProperties['color'];
	/** The color of the label @default TROOMI_COLORS.$primaryTextColor */
	labelColor?: CSSProperties['color'];
	/** The size of the icon @default '16px' */
	iconSize?: CSSProperties['fontSize'];
};

export type RadioGroupOption<V = string | number, L = string> = RadioOptions & {
	/** The value of the option */
	value: V;
	/** The text to display next to the option */
	label: L;
	/** Whether the option is disabled @default false */
	isDisabled?: boolean;
};

export interface RadioGroupProps extends InputControlProps<RadioGroupControlValues> {
	/* ~~~~~~ Required ~~~~~~ */

	/** The options for the radio group */
	options: RadioGroupOption[];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The id of the radioGroup */
	id?: string;
	/** The className of the radioGroup. Will always contain `rsRadioGroup` */
	className?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Whether the radio group is disabled @default false */
	isDisabled?: boolean;
	/** The name for the radio group defaults the to the formKey of the control,
	 * If the control does not have a formKey, then you must provide a name
	 * @default control.formKey */
	name?: string;
	/** The default values for each radio option,
	 * @see {@link DEFAULT_RADIO_OPTIONS} */
	defaultRadioOptions?: RadioOptions;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The direction of the radio group */
	flexDirection?: CSSProperties['flexDirection'];
	/** The justify-content property of the radio group */
	justifyContent?: CSSProperties['justifyContent'];
	/** The align-items property of the radio group */
	alignItems?: CSSProperties['alignItems'];
	/** The space between each radio option */
	gap?: CSSProperties['gap'];
	/** The flex-wrap property of the radio group */
	flexWrap?: CSSProperties['flexWrap'];
	/** Additional CSS styles to apply to the checkbox */
	style?: CSSProperties;
}

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
	const [control, updateControl] = useInputControl<RadioGroupControlValues>(props);
	const {
		name = control.formKey,
		defaultRadioOptions,
		isDisabled = false,
		flexDirection,
		className,
		flexWrap,
		options,
		style,
		gap,
		id
	} = props;

	const isRequired = control.has(RequiredValidator);
	const isInvalid = !control.isValid;

	function handleBlur() {
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>, option: RadioGroupOption) {
		const target = e.target;
		const targetValue = option.value;

		const updatedControl = control.clone();
		if (!updatedControl) return;

		const updatedValue = updateControl((prev) => {
			prev.value = targetValue;
			return prev;
		}).value;

		target.checked = updatedValue === targetValue;
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!flexDirection) styles.flexDirection = flexDirection;
		if (!!flexWrap) styles.flexWrap = flexWrap;
		if (!!gap) styles.gap = gap;

		return { ...styles, ...style };
	}

	function renderSingleOption(option: RadioGroupOption, index: number) {
		const {
			deselectedRadioColor,
			selectedRadioColor,
			deselectedIconImg,
			disabledIconImg,
			selectedIconImg,
			textVariant,
			labelColor,
			isDisabled,
			iconSize,
			iconImg,
			value,
			label
		} = {
			...DEFAULT_RADIO_OPTIONS,
			...defaultRadioOptions,
			...option
		};

		const isSelected = control.value === option.value;
		let radioIconImg = 'none';
		if (isSelected) radioIconImg = selectedIconImg;
		else radioIconImg = deselectedIconImg;
		if (isDisabled) radioIconImg = disabledIconImg;
		if (radioIconImg === 'none') radioIconImg = iconImg;

		const labelRadioClasses = ['labelRadio'];
		if (isSelected) labelRadioClasses.push('selected');
		if (isDisabled) labelRadioClasses.push('disabled');

		const radioOptionClasses = ['radioOption'];
		if (isSelected) radioOptionClasses.push('selected');
		if (isDisabled) radioOptionClasses.push('disabled');
		if (radioIconImg !== 'none') radioOptionClasses.push(radioIconImg);

		const radioLabelClasses = ['radioLabel'];
		if (isSelected) radioLabelClasses.push('selected');
		if (isDisabled) radioLabelClasses.push('disabled');

		return (
			<div className={labelRadioClasses.join(' ')} key={index} aria-disabled={isDisabled}>
				<input
					role="radio"
					type="radio"
					onBlur={handleBlur}
					style={{ color: isSelected ? selectedRadioColor : deselectedRadioColor, fontSize: iconSize }}
					onChange={(e) => handleChange(e, option)}
					className={radioOptionClasses.join(' ')}
					name={`${name ?? id}-${value}`}
					id={`${name ?? id}-${index}`}
					checked={isSelected}
					disabled={isDisabled || props.isDisabled}
				/>
				<Label
					style={{ color: labelColor }}
					className={radioLabelClasses.join(' ')}
					htmlFor={`${name ?? id}-${index}`}
					variant={textVariant}
				>
					{label}
				</Label>
			</div>
		);
	}

	function getClassName() {
		const classes = ['rsRadioGroup'];
		if (!!className) classes.push(className);
		if (isInvalid) classes.push('error');

		return classes.join(' ');
	}

	function renderRadioOptions() {
		if (!name && !id) throw new Error(NO_RADIO_GROUP_NAME_ERROR);
		return options.map((option, index) => renderSingleOption(option, index));
	}

	return (
		<>
			<div
				role="radioGroup"
				className={getClassName()}
				style={getStyle()}
				id={id}
				aria-invalid={!control.isValid}
				aria-required={isRequired}
				aria-disabled={isDisabled}
			>
				{renderRadioOptions()}
			</div>
			<ErrorMessage control={control} />
		</>
	);
};

export default RadioGroup;
