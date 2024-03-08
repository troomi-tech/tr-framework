import { clone, cloneDeep } from 'lodash';
import FormControl from './FormControl';

/**
 * A collection of {@link FormControl}'s that are mapped together in an object.
 * @see {@link FormControl}
 */
class FormGroup<T extends { [key: string]: FormControl<any> }> {
	/** The internal controls of the form group. @private */
	private _controls: T;

	/**
	 * Creates a new `FormGroup` with the given controls.
	 * @param {T} controls An object of `FormControl`'s.
	 * @see {@link FormControl}
	 */
	constructor(controls: T) {
		this._controls = controls;
	}

	/**
	 * Iterates over the controls of the form group.
	 * @param {Function} callback The function to call for each control.
	 */
	private iterateControls(callback: (key: keyof T, control: T[keyof T]) => void): void {
		Object.keys(this.controls).forEach((key: keyof T) => callback(key, this.controls[key]));
	}

	/** The controls of the form group. @see {@link FormControl} */
	get controls(): T {
		Object.entries(this._controls).forEach(([key, control]) => {
			control.formGroup = this;
			control.formKey = key;
		});
		return this._controls;
	}

	/** Whether or not one of the controls is touched. @see {@link FormControl.isTouched} */
	get isTouched(): boolean {
		let isTouched = false;
		this.iterateControls((_, control) => (isTouched ||= control.isTouched));
		return isTouched;
	}

	/** Sets the touched state of all controls. @see {@link FormControl.isTouched} */
	set isTouched(value: boolean) {
		this.iterateControls((_, control) => (control.isTouched = value));
	}

	/** Whether or not all of the controls are pristine. @see {@link FormControl.isPristine} */
	get isPristine(): boolean {
		let isPristine = true;
		this.iterateControls((_, control) => (isPristine &&= control.isPristine));
		return isPristine;
	}

	/** Whether or not one of the controls is dirty. @see {@link FormControl.isDirty} */
	get isDirty(): boolean {
		let isDirty = false;
		this.iterateControls((_, control) => (isDirty ||= control.isDirty));
		return isDirty;
	}

	/** Whether or not all of the controls are valid. @see {@link FormControl.isValid} */
	get isValid(): boolean {
		let isValid = true;
		this.iterateControls((_, control) => (isValid &&= control.isValid));
		return isValid;
	}

	/**
	 * Gets the `FormControl` with the given key.
	 * @deprecated Use {@link FormGroup.controls} instead.
	 * {@link FormControl}
	 */
	get<K extends keyof T>(key: K): T[K] {
		return this.controls[key];
	}

	/**
	 * Takes a `FormControl` and replaces the one with the `formKey` of the given control.
	 * If the control has no `formKey` or the `FormGroup` has no control with the given `formKey`,
	 * an error will be thrown.
	 * @param {FormControl} control The control to update.
	 */
	update<C extends T[keyof T]>(control: C): void {
		const controlKey = control.formKey as keyof T | undefined;
		if (!controlKey || !this.controls[controlKey])
			throw new Error(`WARNING: FormGroup ${this} tried to update the control ${control} but had no key.`);
		this.controls[controlKey] = control;
	}

	/** Returns a shallow clone of the form group. */
	clone(): this {
		return clone(this);
	}

	/** Returns a deep clone of the form group. */
	cloneDeep(): this {
		return cloneDeep(this);
	}

	/** Resets all of `FormControls` to they're initial values. @see {@link FormControl.reset} */
	reset(): void {
		this.iterateControls((_, control) => control.reset());
	}
}

export default FormGroup;
