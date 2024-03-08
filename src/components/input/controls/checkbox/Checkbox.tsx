import React, { CSSProperties } from 'react';
import './Checkbox.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import * as Icomoon from '../../../../icomoon/types/Icomoon';
import { RequiredValidator } from '../../../../form/Validators';
import { InputControlProps } from '../../input.types';
import useInputControl from '../../../../hooks/useInputControl';

export type CheckboxControlValues = boolean;

export interface CheckboxProps extends InputControlProps<CheckboxControlValues> {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the checkbox. Will always contain `rsCheckbox` and `rsInput`.
	 * When checked, the className will also contain `checked`.
	 * When unchecked, the className will also contain `unchecked`.*/
	className?: string;
	/** The id of the checkbox */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The shape of the checkbox.
	 * If icon the checkbox will just be the current icon image at full width.
	 * @default square */
	shape?: 'square' | 'circle' | 'icon';
	/** The icon to use when the checkbox is checked @default icon-check */
	checkedIconImg?: `icon-${Icomoon.GlyphNames}` | 'none';
	/** The icon to use when the checkbox is unchecked @default none */
	uncheckedIconImg?: `icon-${Icomoon.GlyphNames}` | 'none';

	/* ~~~~~~ Styling ~~~~~~ */

	/** The color of the checkbox when checked */
	checkedColor?: CSSProperties['color'];
	/** The color of the checkbox when unchecked */
	uncheckedColor?: CSSProperties['color'];
	/** Additional CSS styles to apply to the checkbox */
	style?: CSSProperties;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
	const [control, updateControl] = useInputControl<CheckboxControlValues>(props);
	const {
		checkedIconImg = 'icon-check',
		uncheckedIconImg = 'none',
		shape = 'square',
		uncheckedColor,
		checkedColor,
		className,
		style,
		id
	} = props;

	const isRequired = control.has(RequiredValidator);
	const isInvalid = !control.isValid;
	const isChecked = !!control.value;

	function handleBlur() {
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const target = event.target;
		const targetValue = !!target.checked;

		const updatedControl = control.clone();
		if (!updatedControl) return;

		const updatedValue = updateControl((prev) => {
			prev.value = targetValue;
			return prev;
		}).value;

		target.checked = updatedValue;
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (isChecked && !!checkedColor) styles.color = checkedColor;
		if (!isChecked && !!uncheckedColor) styles.color = uncheckedColor;

		return { ...styles, ...style };
	}

	function getClassName() {
		const classes = ['rsCheckbox'];
		if (!!className) classes.push(className);
		if (!!shape) classes.push(shape);
		if (isInvalid) classes.push('error');
		if (isChecked) {
			classes.push('checked');
			const shouldAddCheckedIcon = checkedIconImg !== 'none' && !!checkedIconImg;
			if (shouldAddCheckedIcon) classes.push(checkedIconImg);
		} else {
			classes.push('unchecked');
			const shouldAddUncheckedIcon = uncheckedIconImg !== 'none' && !!uncheckedIconImg;
			if (shouldAddUncheckedIcon) classes.push(uncheckedIconImg);
		}

		return classes.join(' ');
	}

	return (
		<>
			<input
				role="checkbox"
				type="checkbox"
				className={getClassName()}
				onChange={handleChange}
				onBlur={handleBlur}
				style={getStyle()}
				name={control.formKey}
				checked={isChecked}
				id={id}
				aria-errormessage={control.errors[0]}
				aria-required={isRequired}
				aria-invalid={isInvalid}
			/>
			<ErrorMessage control={control} />
		</>
	);
};

export default Checkbox;
