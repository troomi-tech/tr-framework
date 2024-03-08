import React, { Validator, useRef } from 'react';
import './InputCell.scss';
import TextInput, { TextInputProps, TextInputControlValues } from '../../../input/controls/textInput/TextInput';
import { debounce } from 'lodash';
import BaseCell, { BaseCellProps } from '../BaseCell';
import FormControl from '../../../../form/FormControl';
import { useFormControl } from '../../../../hooks';

export interface InputCellProps extends BaseCellProps<TextInputControlValues> {
	/* ~~~~~~ Advanced ~~~~~~ */

	/** The validators to be used inside the input control. @default [] @see {@link Validator} */
	validators?: Validator<string | number>[];
	/** The delay in milliseconds to wait before updating the control. @default 0 */
	debounceDelay?: number;
	/** The placeholder to be used inside the input control. @default '' */
	placeholder?: TextInputProps['placeholder'];
	/** The type to be used inside the input control. @default 'text' */
	type?: TextInputProps['type'];
	/** The look to be used inside the input control. @default 'custom' */
	look?: TextInputProps['look'];
	/** The function that will be called before the control is updated.
	 * @param {TextInputControlValues} value The value of the control. */
	beforeUpdate?: (value: TextInputControlValues) => TextInputControlValues;
	/** The function that will be called each time the control is updated.
	 * if a form control is returned, the control will be updated with the returned control.
	 * @param {RsFormControl} control The control that was updated.
	 * @see {@link RsFormControl} */
	onControlUpdate?: (control: FormControl<TextInputControlValues>) => void;
}

const InputCell: React.FC<InputCellProps> = (props) => {
	const {
		debounceDelay = 0,
		validators = [],
		placeholder = '',
		look = 'custom',
		type = 'text',
		onControlUpdate,
		beforeUpdate,
		...baseCellProps
	} = props;

	const [inputControl, updateInputControl] = useFormControl(baseCellProps.data, ...validators);
	const debounceRef = useRef(debounce(handleDebounceOnControlUpdate, debounceDelay));

	function getClassName() {
		const classes = ['rsInputCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	function handleDebounceOnControlUpdate(control: FormControl) {
		if (!!onControlUpdate) onControlUpdate(control);
		updateInputControl(control);
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			<TextInput
				type={type}
				beforeUpdate={beforeUpdate}
				onControlUpdate={debounceRef.current}
				placeholder={placeholder}
				control={inputControl}
				look={look}
			/>
		</BaseCell>
	);
};

export default InputCell;
