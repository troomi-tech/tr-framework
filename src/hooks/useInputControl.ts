import { useEffect, useState } from 'react';
import { InputControlProps } from '../components/input/input.types';
import FormControl from '../form/FormControl';

/** A function that properly updates the control and returns the new updated control.
 * @param {FormControl<T> | ((control: FormControl<T>): FormControl<T>)} update The update to apply to the control.
 * @returns {FormControl<T>} The new updated control. */
export type UpdateControlFunction<T> = (
	update: FormControl<T> | ((control: FormControl<T>) => FormControl<T>)
) => FormControl<T>;

/**
 * Used for creating a InputControl component to handle formGroups and formControls.
 * Not to be confused with [useFormControl](.\useFormControl.ts)
 * @param {InputControlProps<T>} controlProps The props that all input controls share.
 * @returns {[FormControl<T>, UpdateControlFunction<T>]} A tuple containing the control and the updateControl function.
 * @example
 * interface PhoneInputProps extends InputControlProps<number> {
 * 	countryCode: number;
 * }
 *
 * const PhoneInput: React.FC<PhoneInputProps> = (props) => {
 * 	const [control, updateControl] = useInputControl(props);
 * 	const { countryCode } = props;
 *
 * 	function handleChange(e) {
 * 		updateControl(e.target.value);
 * 	}
 *
 * 	return (
 * 		<input
 * 			value={`+${countryCode} ${control.value}`}
 * 			onChange={handleChange}
 * 			autocomplete="tel"
 * 			type="tel"
 * 		/>
 * 	);
 * };
 */
export default function useInputControl<T>(
	controlProps: InputControlProps<T>
): readonly [FormControl<T>, UpdateControlFunction<T>] {
	const { control, onControlUpdate, beforeUpdate } = controlProps;
	const [controlState, setControlState] = useState<FormControl<T>>(control);

	useEffect(() => {
		setControlState((prev) => {
			const newControl = control.clone();
			if (!!beforeUpdate) newControl.value = beforeUpdate(newControl.value);
			if (prev.equals(newControl)) return prev.clone();
			if (!!onControlUpdate) onControlUpdate(newControl);
			return newControl;
		});
	}, [control, beforeUpdate, onControlUpdate]);

	const updateControl: UpdateControlFunction<T> = (update) => {
		const updatedControl = typeof update === 'function' ? update(control.clone()) : update;
		if (!!beforeUpdate) updatedControl.value = beforeUpdate(updatedControl.value);
		if (!!onControlUpdate) onControlUpdate(updatedControl);
		setControlState(updatedControl);
		return updatedControl;
	};

	return [controlState, updateControl];
}
