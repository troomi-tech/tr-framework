import { clone, cloneDeep } from 'lodash';
import FormGroup from './FormGroup';
import FormValidator from './FormValidator';

/**
 * A representation of a piece of data that is used in a form.
 * Takes in a generic type that represents the type of data that is stored.
 * Takes in a list of {@link FormValidator}'s that are used to validate the data.
 * Typically used in a {@link FormGroup}.
 * @see {@link FormGroup}
 */
class FormControl<T = any> {
	/** The internal value of the form control. @private */
	private _value: T;
	/** The internal dirty state of the form control. @private */
	private _isDirty: boolean;
	/** The internal validators of the form control. @private */
	private _validators: FormValidator<T>[];

	/** The {@link FormGroup} that the form control is a part of. */
	formGroup: FormGroup<any> | undefined;
	/** The key of the form control in the {@link FormGroup}.
	 * Get's set automatically when the form control is added to a {@link FormGroup}. */
	formKey: string | undefined;

	/** The initial value of the form control. */
	initialValue: T;
	/** Whether or not the form control has been touched. */
	isTouched: boolean;

	/**
	 * Creates a new `FormControl` with the given initial value and validators.
	 * @param {T} initialValue The initial value of the form control.
	 * @param {FormValidator<T>[]} validators The validators that determine if the control `isValid`.
	 * @see {@link FormValidator}
	 * @see {@link FormGroup}
	 */
	constructor(initialValue: T, ...validators: FormValidator<T>[]) {
		this._validators = validators;
		this._value = initialValue;
		this._isDirty = false;

		this.initialValue = initialValue;
		this.isTouched = false;
	}

	/**
	 * The error messages of the form control.
	 * Each error message is determined by the {@link FormValidator}'s that are passed into the constructor.
	 */
	get errors(): FormValidator<T>['errorMessage'][] {
		return this._validators
			.filter((validator) => !validator.validate(this._value))
			.map((validator) => validator.errorMessage);
	}

	/** Whether or not the form control should show errors to the user.
	 * This is determined by whether or not the control is touched and if it is valid. */
	get shouldShowErrors(): boolean {
		return this.isTouched && !this.isValid;
	}

	/**
	 * Whether or not the form control is valid.
	 * This is determined by whether or not the control has any errors.
	 * @see {@link FormControl.errors}
	 */
	get isValid(): boolean {
		return this.errors.length <= 0;
	}

	/** Whether or not the form control is dirty. This is determined by whether or not the value has changed. */
	get isDirty(): boolean {
		return this._isDirty;
	}

	/** The value of the form control. */
	get value(): T {
		return this._value;
	}

	/**
	 * Sets the value of the form control and marks it as dirty.
	 * @param {T} value The new value of the form control.
	 */
	set value(value: T) {
		this._isDirty = true;
		this._value = value;
	}

	/**
	 * Whether or not the `FormControl` has been changed from it's initial value.
	 * This is determined by whether or not the value has changed and if the control is dirty.
	 */
	get isPristine(): boolean {
		const isAtInitialValue = this._value === this.initialValue;
		const isDirty = this._isDirty;
		return isAtInitialValue && !isDirty;
	}

	/** Returns a shallow clone of the form control. */
	clone(): this {
		return clone(this);
	}

	/** Returns a deep clone of the form control. */
	cloneDeep(): this {
		return cloneDeep(this);
	}

	/**
	 * Gets the {@link FormValidator} with the given type.
	 * @param validator The type of the validator to get.
	 * @returns The validator if it exists, otherwise `undefined`.
	 */
	get<V extends new (...args: any[]) => FormValidator<T>>(validator: V): InstanceType<V> | undefined {
		return this._validators.find((v) => v instanceof validator) as InstanceType<V> | undefined;
	}

	/**
	 *  Returns whether or not the form control has a {@link FormValidator} with the given type. *
	 * @param validator The type of the validator to check for.
	 * @returns Whether or not the form control has the validator.
	 * @see {@link FormControl.get}
	 */
	has<V extends new (...args: any[]) => FormValidator<T>>(validator: V): boolean {
		return !!this.get(validator);
	}

	/**
	 * Sets the value back to the initial value, marks the control as not dirty and not touched.
	 * @see {@link FormControl.initialValue}
	 * @see {@link FormControl.isTouched}
	 * @see {@link FormControl.isDirty}
	 */
	reset(): void {
		this._value = this.initialValue;
		this._isDirty = false;
		this.isTouched = false;
	}

	/** Sets the value back to the initial value. @see {@link FormControl.initialValue} */
	resetToInitialValue(): void {
		this._value = this.initialValue;
	}

	/** Compares the form control to another form control. */
	equals(control: FormControl): boolean {
		return (
			this._value === control._value &&
			this.formKey === control.formKey &&
			this._isDirty === control._isDirty &&
			this.isTouched === control.isTouched &&
			this.formGroup === control.formGroup &&
			this.initialValue === control.initialValue &&
			this._validators.length === control._validators.length &&
			this._validators.every((validator, index) => validator === control._validators[index])
		);
	}
}

export default FormControl;
