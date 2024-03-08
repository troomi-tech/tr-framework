import { useState } from 'react';
import FormControl from '../form/FormControl';
import { Validator } from '../form';

type UseFormControlUpdateFunction<T> = (control: FormControl<T>) => void;

/**
 * Syntax sugar for creating a single form control and updating it.
 * @param initialValue The initial value of the form control.
 * @param validators any number of validators to apply to the form control.
 * @returns A tuple containing the form group. and a function that either takes a form control or a form group to update the form group.
 * @example
 * const [formControl, updateFormControl] = useFormControl(
 *  '', Validators.REQ(), Validators.CHAR()
 * );
 *
 * <LabelInput
 * 	label={'Name'}
 * 	placeholder="Name"
 * 	control={formGroup.controls.firstName}
 * 	onControlUpdate={updateFormGroup}
 * 	type="text"
 * />
 */
export default function useFormControl<T>(
	initialValue: T,
	...validators: Validator<T>[]
): [FormControl<T>, UseFormControlUpdateFunction<T>] {
	const [formControl, setFormControl] = useState<FormControl<T>>(new FormControl(initialValue, ...validators));
	return [formControl, (control) => setFormControl(control.clone())];
}
