/**
 * Abstract class for validating a certain type of data
 * Used in a {@link FormControl} to validate whether it's valid.
 * @abstract
 */
abstract class FormValidator<T> {
	/**
	 * Creates a new `FormValidator` with the given error message.
	 * @param {string} _errorMessage The error message of the validator.
	 * @see {@link FormControl}
	 */
	constructor(protected _errorMessage: string) {}

	/** Returns the error message of the validator */
	get errorMessage() {
		return this._errorMessage;
	}

	/**
	 * Abstract method to validate a value
	 * @param {T} value The value to validate
	 * @returns {boolean} Whether the value is valid
	 * @abstract
	 */
	abstract validate(value: T): boolean;
}

export default FormValidator;
