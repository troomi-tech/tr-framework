import FormControl from '../../form/FormControl';

export interface InputControlProps<T> {
	/* ~~~~~~ Required ~~~~~~ */

	/** The form control of the input. */
	control: FormControl<T>;
	/** Callback for when the input value changes.
	 * @param {FormControl<T>} control The new control. */
	onControlUpdate: (control: FormControl<T>) => void;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Called before `onControlUpdate` to allow for the control to be modified before it is updated
	 * useful for things like formatting the value of the control on user input
	 * @param {T} value The value of the input.
	 * @returns {T} The new value of the input. */
	beforeUpdate?: (value: T) => T;
}

export type AutoCompleteTypes =
	| 'off'
	| 'on'
	| 'autocomplete'
	| 'name'
	| 'honorific-prefix'
	| 'given-name'
	| 'additional-name'
	| 'family-name'
	| 'honorific-suffix'
	| 'nickname'
	| 'email'
	| 'username'
	| 'new-password'
	| 'current-password'
	| 'one-time-code'
	| 'organization-title'
	| 'organization'
	| 'street-address'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'address-level4'
	| 'address-level3'
	| 'address-level2'
	| 'address-level1'
	| 'country'
	| 'country-name'
	| 'postal-code'
	| 'cc-name'
	| 'cc-given-name'
	| 'cc-additional-name'
	| 'cc-family-name'
	| 'cc-number'
	| 'cc-exp'
	| 'cc-exp-month'
	| 'cc-exp-year'
	| 'cc-csc'
	| 'cc-type'
	| 'transaction-currency'
	| 'transaction-amount'
	| 'language'
	| 'bday'
	| 'bday-day'
	| 'bday-month'
	| 'bday-year'
	| 'sex'
	| 'tel'
	| 'tel-country-code'
	| 'tel-national'
	| 'tel-area-code'
	| 'tel-local'
	| 'tel-local-prefix'
	| 'tel-local-suffix'
	| 'tel-extension'
	| 'impp'
	| 'url'
	| 'photo';
