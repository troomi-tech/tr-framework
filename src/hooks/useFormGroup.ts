import { useCallback, useState } from 'react';
import FormControl from '../form/FormControl';
import FormGroup from '../form/FormGroup';

type UseFormGroupUpdateFunction<T extends { [key: string]: FormControl }> = (value: FormControl | FormGroup<T>) => void;

/**
 * Hook to create a form group and update it.
 * @param controls Takes an object of form controls. @see {@link FormGroup}
 * @returns A tuple containing the form group. and a function that either takes a form control or a form group to update the form group.
 * @example
 * const [formGroup, updateFormGroup] = useFormGroup({
 * 	name: new FormControl<string>('', Validators.REQ()),
 * 	age: new FormControl<number>(0, Validators.NUM())
 * });
 *
 * <LabelInput
 * 	label={'Name'}
 * 	placeholder="Name"
 * 	control={formGroup.controls.firstName}
 * 	onControlUpdate={updateFormGroup}
 * 	type="text"
 * />
 * <LabelInput
 * 	label={'Age'}
 * 	placeholder="Age"
 * 	control={formGroup.controls.age}
 * 	onControlUpdate={updateFormGroup}
 * 	type="number"
 * />
 */
export default function useFormGroup<T extends { [key: string]: FormControl }>(
	controls: T
): [FormGroup<T>, UseFormGroupUpdateFunction<T>] {
	const [formGroup, setFormGroup] = useState<FormGroup<T>>(new FormGroup(controls));

	const updateFormGroup = useCallback(
		(value: FormControl | FormGroup<T>) => {
			setFormGroup((prevFormGroup) => {
				const updatedFormGroup = prevFormGroup.clone();
				if (value instanceof FormGroup) return value.cloneDeep();
				else updatedFormGroup.update(value as T[keyof T]);
				return updatedFormGroup;
			});
		},
		[setFormGroup]
	);

	return [formGroup, updateFormGroup];
}
