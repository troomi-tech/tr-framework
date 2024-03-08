import React, { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from 'react';
import './TextInput.scss';
import './TextInputLooks.scss';
import FormControl from '../../../../form/FormControl';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { AutoCompleteTypes, InputControlProps } from '../../input.types';
import { StringUtils } from '../../../../utils';
import { TypingUtils } from '../../../../utils/TypingUtils';
import { MaxLengthValidator, MinLengthValidator, RegexValidator, RequiredValidator } from '../../../../form/Validators';
import useInputControl from '../../../../hooks/useInputControl';

export type TextInputControlValues = string | number | undefined | null;

type HTMLTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
type HTMLInputProps = InputHTMLAttributes<HTMLInputElement>;
type HTMLSharedProps = HTMLTextAreaProps & HTMLInputProps;

type ConditionalTextAreaProps = {
	/** The visible width of the text control, in average character widths. Must be a positive integer. */
	cols?: HTMLTextAreaProps['cols'];
	/** The number of visible text lines for the control. Must be a positive integer. */
	rows?: HTMLTextAreaProps['rows'];
	/** Specifies how the text in a text area is to be wrapped when submitted in a form. */
	wrap?: HTMLTextAreaProps['wrap'];
	/** Specifies whether a resize handle should be displayed or not. @default 'vertical' */
	resize?: CSSProperties['resize'];
};

type ConditionalInputProps = {
	/** A regular expression that the control's value is checked against.
	 * @default control.get(RsValidatorEnum.REG) */
	pattern?: HTMLInputProps['pattern'];
};

type ConditionalProps =
	| ({ type: 'textarea' } & ConditionalTextAreaProps & TypingUtils.MakeAllNever<ConditionalInputProps>)
	| ({ type?: 'text' | 'password' | 'tel' | 'email' } & ConditionalInputProps &
			TypingUtils.MakeAllNever<ConditionalTextAreaProps>);

type SharedProps = InputControlProps<TextInputControlValues> & {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the input. Will always contain `rsTextInput` and `rsInput`. */
	className?: string;
	/** The id of the input */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The type of the input control.
	 * If type is 'textarea' then the control will be a textarea.
	 * @default 'text' */
	type?: 'text' | 'password' | 'textarea' | 'tel' | 'email' | 'hidden';
	/** Callback for when the input is focused */
	onFocus?: (control: FormControl<TextInputControlValues>) => void;
	/** Callback for when the input is blurred */
	onBlur?: (control: FormControl<TextInputControlValues>) => void;
	/** The autocomplete attribute of the input @default 'on' */
	autocomplete?: AutoCompleteTypes;
	/** The placeholder text of the input @default ' ' */
	placeholder?: HTMLSharedProps['placeholder'];
	/** indicating that an element should be focused on page load */
	autoFocus?: HTMLSharedProps['autoFocus'];
	/** The maximum length of the input @default control.get(RsValidatorEnum.MAX)*/
	maxLength?: HTMLSharedProps['maxLength'];
	/** The minimum length of the input @default control.get(RsValidatorEnum.MIN)*/
	minLength?: HTMLSharedProps['minLength'];
	/** Whether the input is disabled @default false */
	disabled?: HTMLSharedProps['disabled'];
	/** The name of the input @default control.key */
	name?: HTMLSharedProps['name'];
	/** Whether to disable autocomplete on the input @default false */
	noAutocomplete?: boolean;
	/** The look of the input @default 'underline' */
	look?: 'box' | 'underline' | 'custom' | 'none';

	/* ~~~~~~ Styling ~~~~~~ */

	/** The color of the border on the input */
	borderColor?: CSSProperties['borderColor'];
	/** The background color of the input */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The text color of the input */
	textColor?: CSSProperties['color'];
	/** Additional CSS styles to apply to the input */
	style?: CSSProperties;
};

export type TextInputProps = SharedProps & ConditionalProps;

const TextInput = forwardRef<HTMLInputElement & HTMLTextAreaElement, TextInputProps>((props, ref) => {
	const [control, updateControl] = useInputControl<TextInputControlValues>(props);

	const {
		maxLength = getDefaultMaxLength(),
		minLength = getDefaultMinLength(),
		pattern = getDefaultPattern(),
		noAutocomplete = false,
		name = control.formKey,
		disabled = false,
		autocomplete = 'on',
		look = 'underline',
		placeholder = ' ',
		type = 'text',
		backgroundColor,
		borderColor,
		textColor,
		autoFocus,
		className,
		style,
		id,
		onFocus,
		onBlur,
		...textAreaProps
	} = props;
	const { resize = 'vertical', cols, rows, wrap } = textAreaProps;

	const [isFocused, setIsFocused] = useState<boolean>(false);

	const isRequired = control.has(RequiredValidator);
	const isInvalid = !control.isValid;

	function getDefaultPattern(): TextInputProps['pattern'] {
		const validator = control.get(RegexValidator);
		if (!validator) return undefined;
		return String(validator.value);
	}

	function getDefaultMaxLength(): TextInputProps['maxLength'] {
		const validator = control.get(MaxLengthValidator);
		if (!validator) return undefined;
		const asNumber = Number(validator.value);
		if (isNaN(asNumber)) return undefined;
		return asNumber;
	}

	function getDefaultMinLength(): TextInputProps['minLength'] {
		const validator = control.get(MinLengthValidator);
		if (!validator) return undefined;
		const asNumber = Number(validator.value);
		if (isNaN(asNumber)) return undefined;
		return asNumber;
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
		setIsFocused(true);

		const target = event.target;
		const targetValue = target.value;

		const startPosition = target.selectionStart ?? 0;
		const endPosition = target.selectionEnd ?? 0;

		let updatedValue = updateControl((prev) => {
			prev.value = targetValue;
			return prev;
		}).value;
		updatedValue = String(updatedValue ?? '');

		target.value = updatedValue;

		const cursorOffset = StringUtils.getCursorOffset(startPosition, updatedValue, targetValue);
		target.setSelectionRange(startPosition + cursorOffset, endPosition + cursorOffset);
	}

	function getClassName(): HTMLSharedProps['className'] {
		const classes = ['rsTextInput'];
		if (!!className) classes.push(className);
		if (!!look && look !== 'none') classes.push(look);

		if (isInvalid) classes.push('invalid');
		if (type === 'textarea') classes.push('textarea');

		return classes.join(' ');
	}

	function getAutocomplete(): HTMLSharedProps['autoComplete'] {
		if (noAutocomplete) return 'off';
		if (autocomplete) return autocomplete;
		return 'on';
	}

	function getStyle(): CSSProperties {
		const styles: CSSProperties = {};
		if (!!textColor) styles.color = textColor;
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!borderColor) styles.borderColor = borderColor;
		if (!!resize) styles.resize = resize;

		return { ...styles, ...style };
	}

	function getDisplayValue(): string {
		let controlValue = control.value;
		return String(controlValue ?? '');
	}

	function handleFocus() {
		if (!!onFocus) onFocus(control);
		setIsFocused(true);
	}

	function handleBlur() {
		if (!!onBlur) onBlur(control);
		setIsFocused(false);
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	function renderTextArea() {
		return (
			<textarea
				autoComplete={getAutocomplete()}
				className={getClassName()}
				value={getDisplayValue()}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				style={getStyle()}
				placeholder={placeholder}
				autoFocus={autoFocus}
				disabled={disabled}
				name={name}
				rows={rows}
				cols={cols}
				wrap={wrap}
				ref={ref}
				id={id}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
			/>
		);
	}

	function renderInput() {
		const inputType = isFocused && type !== 'password' ? 'text' : type;

		return (
			<input
				autoComplete={getAutocomplete()}
				className={getClassName()}
				value={getDisplayValue()}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				style={getStyle()}
				placeholder={placeholder}
				autoFocus={autoFocus}
				maxLength={maxLength}
				minLength={minLength}
				disabled={disabled}
				pattern={pattern}
				type={inputType}
				name={name}
				ref={ref}
				id={id}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
			/>
		);
	}

	return (
		<>
			{type === 'textarea' ? renderTextArea() : renderInput()}
			<ErrorMessage control={control} />
		</>
	);
});

export default TextInput;
