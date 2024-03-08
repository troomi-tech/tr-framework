import React, { CSSProperties, InputHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import './NumericInput.scss';
import './NumericInputLooks.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { AutoCompleteTypes, InputControlProps } from '../../input.types';
import FormControl from '../../../../form/FormControl';
import { MaxLengthValidator, MinLengthValidator, RequiredValidator } from '../../../../form/Validators';
import { StringUtils } from '../../../../utils';
import useInputControl from '../../../../hooks/useInputControl';

export type NumericInputControlValues = number | undefined;

type HTMLInputProps = InputHTMLAttributes<HTMLInputElement>;

export interface NumericInputProps extends InputControlProps<NumericInputControlValues> {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the input. Will always contain `rsTextInput` and `rsInput`. */
	className?: string;
	/** The id of the input */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Callback for when the input is focused */
	onFocus?: (control: FormControl<NumericInputControlValues>) => void;
	/** Callback for when the input is blurred */
	onBlur?: (control: FormControl<NumericInputControlValues>) => void;
	/** The autocomplete attribute of the input @default 'on' */
	autocomplete?: AutoCompleteTypes;
	/** The placeholder text of the input @default ' ' */
	placeholder?: HTMLInputProps['placeholder'];
	/** indicating that an element should be focused on page load */
	autoFocus?: HTMLInputProps['autoFocus'];
	/** The maximum length of the input @default control.get(RsValidatorEnum.MAX)*/
	maxLength?: HTMLInputProps['maxLength'];
	/** The minimum length of the input @default control.get(RsValidatorEnum.MIN)*/
	minLength?: HTMLInputProps['minLength'];
	/** The maximum value of the input */
	maxValue?: number;
	/** The minimum value of the input */
	minValue?: number;
	/** Whether the input is disabled @default false */
	disabled?: HTMLInputProps['disabled'];
	/** The name of the input @default control.key */
	name?: HTMLInputProps['name'];
	/** Whether to disable autocomplete on the input @default false */
	noAutocomplete?: boolean;
	/** The look of the input @default 'underline' */
	look?: 'box' | 'underline' | 'none';
	/** Whether to allow negative values @default false */
	doesAllowNegative?: boolean;
	/** Whether to allow decimal values @default false */
	doesAllowDecimal?: boolean;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The color of the border on the input */
	borderColor?: CSSProperties['borderColor'];
	/** The background color of the input */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The text color of the input */
	textColor?: CSSProperties['color'];
	/** Additional CSS styles to apply to the input */
	style?: CSSProperties;
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>((props, ref) => {
	const [control, updateControl] = useInputControl<NumericInputControlValues>(props);
	const {
		maxLength = getDefaultMaxLength(),
		minLength = getDefaultMinLength(),
		doesAllowNegative = false,
		doesAllowDecimal = false,
		noAutocomplete = false,
		name = control.formKey,
		autocomplete = 'on',
		look = 'underline',
		placeholder = ' ',
		disabled = false,
		backgroundColor,
		borderColor,
		textColor,
		autoFocus,
		className,
		minValue,
		maxValue,
		style,
		id,
		onFocus,
		onBlur
	} = props;

	const [displayValue, setDisplayValue] = useState<string>('');

	useEffect(() => {
		if (control.value === control.value) return;
		setDisplayValue(String(control.value ?? ''));
	}, [control.value]);

	const isRequired = control.has(RequiredValidator);
	const isInvalid = !control.isValid;

	function getDefaultMaxLength(): HTMLInputProps['maxLength'] {
		const validator = control.get(MaxLengthValidator);
		if (!validator) return undefined;
		const asNumber = Number(validator.value);
		if (isNaN(asNumber)) return undefined;
		return asNumber;
	}

	function getDefaultMinLength(): HTMLInputProps['minLength'] {
		const validator = control.get(MinLengthValidator);
		if (!validator) return undefined;
		const asNumber = Number(validator.value);
		if (isNaN(asNumber)) return undefined;
		return asNumber;
	}

	function filterValueForDisplay(value: string, oldValue: string = '') {
		if (!value || value === '') return '';
		const strippedValue = StringUtils.removeNonNumeric(value, doesAllowDecimal, doesAllowNegative);
		if (isNaN(Number(strippedValue))) return oldValue;
		return strippedValue;
	}

	function filterValueForControl(value: string): NumericInputControlValues {
		if (value === '') return undefined;
		const valueAsNumber = Number(value);
		if (isNaN(valueAsNumber)) return undefined;
		return valueAsNumber;
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
		const target = event.target;
		const targetValue = target.value;
		const startPosition = target.selectionStart ?? 0;
		const endPosition = target.selectionEnd ?? 0;

		const updatedDisplayValue = filterValueForDisplay(target.value, String(control.value));
		setDisplayValue(updatedDisplayValue);
		target.value = updatedDisplayValue;

		updateControl((prev) => {
			prev.value = filterValueForControl(updatedDisplayValue);
			return prev;
		}).value;

		const cursorOffset = StringUtils.getCursorOffset(startPosition, updatedDisplayValue, targetValue);
		target.setSelectionRange(startPosition + cursorOffset, endPosition + cursorOffset);
	}

	function getClassName(): HTMLInputProps['className'] {
		const classes = ['rsNumericInput'];
		if (!!className) classes.push(className);
		if (!!look && look !== 'none') classes.push(look);
		if (isInvalid) classes.push('error');

		return classes.join(' ');
	}

	function getAutocomplete(): HTMLInputProps['autoComplete'] {
		if (noAutocomplete) return 'off';
		if (autocomplete) return autocomplete;
		return 'on';
	}

	function getStyle(): CSSProperties {
		const styles: CSSProperties = {};
		if (!!textColor) styles.color = textColor;
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!borderColor) styles.borderColor = borderColor;

		return { ...styles, ...style };
	}

	function handleFocus() {
		if (!!onFocus) onFocus(control);
	}

	function handleBlur() {
		if (!!onBlur) onBlur(control);
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	return (
		<>
			<input
				value={displayValue}
				autoComplete={getAutocomplete()}
				className={getClassName()}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				style={getStyle()}
				placeholder={placeholder}
				autoFocus={autoFocus}
				maxLength={maxLength}
				minLength={minLength}
				disabled={disabled}
				min={minValue}
				max={maxValue}
				type={'text'}
				name={name}
				ref={ref}
				id={id}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
				aria-valuemin={minValue}
				aria-valuemax={maxValue}
			/>
			<ErrorMessage control={control} />
		</>
	);
});

export default NumericInput;
