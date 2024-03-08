import StringUtils from '../utils/StringUtils';
import { TypingUtils } from '../utils/TypingUtils';
import FormValidator from './FormValidator';

export class MaxLengthValidator extends FormValidator<{ length: number } | number | TypingUtils.FalsyTypes> {
	constructor(
		public value: number,
		_errorMessage?: string
	) {
		const defaultErrorMessage = `Maximum of ${value} characters allowed.`;
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: { length: number } | number | TypingUtils.FalsyTypes): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		if (typeof value === 'number') return String(value).length <= this.value;
		if (typeof value === 'boolean') return true;
		if (Object.prototype.hasOwnProperty.call(value, 'length')) return value.length <= this.value;
		return false;
	}
}

export class MinLengthValidator extends FormValidator<{ length: number } | number | TypingUtils.FalsyTypes> {
	constructor(
		public value: number,
		_errorMessage?: string
	) {
		const defaultErrorMessage = `Minimum of ${value} characters required.`;
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: { length: number } | number | TypingUtils.FalsyTypes): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		if (typeof value === 'number') return String(value).length >= this.value;
		if (typeof value === 'boolean') return true;
		if (Object.prototype.hasOwnProperty.call(value, 'length')) return value.length >= this.value;
		return false;
	}
}

export class MaxValueValidator extends FormValidator<number | string | undefined | null> {
	constructor(
		public value: number,
		_errorMessage?: string
	) {
		const defaultErrorMessage = `Maximum of ${value} allowed.`;
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: number | string | undefined): boolean {
		const isEmpty = typeof value === 'undefined' || value.toString().trim().length <= 0;
		if (isEmpty) return true;
		const parsedValue = Number(value);
		if (Number.isNaN(parsedValue)) return false;
		return parsedValue <= this.value;
	}
}

export class MinValueValidator extends FormValidator<number | string | undefined> {
	constructor(
		public value: number,
		_errorMessage?: string
	) {
		const defaultErrorMessage = `Minimum of ${value} required.`;
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: number | string | undefined): boolean {
		const isEmpty = typeof value === 'undefined' || value.toString().trim().length <= 0;
		if (isEmpty) return true;
		const parsedValue = Number(value);
		if (Number.isNaN(parsedValue)) return false;
		return parsedValue >= this.value;
	}
}

export class RequiredValidator extends FormValidator<
	number | { length: number } | { size: number } | TypingUtils.FalsyTypes | TypingUtils.TruthyTypes
> {
	constructor(_errorMessage?: string) {
		const defaultErrorMessage = 'This field is required.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(
		value: number | { length: number } | { size: number } | TypingUtils.FalsyTypes | TypingUtils.TruthyTypes
	): boolean {
		if (typeof value === 'number') return true;
		if (typeof value === 'boolean') return value;
		if (typeof value === 'string') return value.trim().length > 0;
		if (typeof value === 'undefined' || value === null) return false;
		if (Object.prototype.hasOwnProperty.call(value, 'length')) return value.length > 0;
		if (Object.prototype.hasOwnProperty.call(value, 'size')) return value.size > 0;
		return !!value;
	}
}

export class NumericValidator extends FormValidator<string | number | TypingUtils.FalsyTypes> {
	constructor(
		_errorMessage?: string,
		public type: 'positiveInteger' | 'integer' | 'positiveFloat' | 'float' = 'positiveInteger'
	) {
		let defaultErrorMessage = 'This field must be a positive integer.';
		if (type === 'integer') defaultErrorMessage = 'This field must be an integer.';
		else if (type === 'positiveFloat') defaultErrorMessage = 'This field must be a positive number.';
		else if (type === 'float') defaultErrorMessage = 'This field must be a number.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: string | number | TypingUtils.FalsyTypes): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		if (typeof value === 'string') {
			if (value.trim().length <= 0) return true;
			const parsedValue = Number(value);
			if (Number.isNaN(parsedValue)) return false;
			if (this.type === 'positiveInteger') return parsedValue > 0 && Number.isInteger(parsedValue);
			else if (this.type === 'integer') return Number.isInteger(parsedValue);
			else if (this.type === 'positiveFloat') return parsedValue > 0;
			else if (this.type === 'float') return true;
		}
		if (typeof value === 'number') {
			if (this.type === 'positiveInteger') return value > 0 && Number.isInteger(value);
			else if (this.type === 'integer') return Number.isInteger(value);
			else if (this.type === 'positiveFloat') return value > 0;
			else if (this.type === 'float') return true;
		}
		return false;
	}
}

export class EmailValidator extends FormValidator<string | number | undefined | null> {
	emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/);

	constructor(_errorMessage?: string) {
		const defaultErrorMessage = 'This field must be a valid email.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: string | number | undefined | null): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		if (value.toString().trim().length <= 0) return true;
		return this.emailRegex.test(value.toString());
	}
}

export class CharactersValidator extends FormValidator<string | number | undefined | null> {
	charactersRegex = new RegExp(/^[A-Za-z0-9-.,\s]*$/);

	constructor(_errorMessage?: string) {
		const defaultErrorMessage = 'This field contains invalid characters.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: string | number | undefined | null): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		const stringValue = String(value);
		if (stringValue.trim().length <= 0) return true;
		return this.charactersRegex.test(stringValue);
	}
}

export class RegexValidator extends FormValidator<string | number | undefined | null> {
	constructor(
		public value: RegExp,
		_errorMessage?: string
	) {
		const defaultErrorMessage = 'This field contains invalid characters.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: string | number | undefined | null): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		const stringValue = String(value);
		if (stringValue.trim().length <= 0) return true;
		return this.value.test(stringValue);
	}
}

export class PhoneValidator extends FormValidator<string | number | undefined | null> {
	constructor(_errorMessage?: string) {
		const defaultErrorMessage = 'This field must be a valid phone number.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: string | number | undefined | null): boolean {
		if (typeof value === 'undefined' || value === null) return true;
		if (value.toString().trim().length <= 0) return true;
		return StringUtils.validateNumberLength(value.toString(), 10);
	}
}

export class CustomValidator<T> extends FormValidator<T> {
	constructor(
		public value: (value: T) => boolean,
		_errorMessage?: string
	) {
		const defaultErrorMessage = 'This field is invalid.';
		super(_errorMessage ?? defaultErrorMessage);
	}

	validate(value: T): boolean {
		return this.value(value);
	}
}

const Validators = {
	CHAR: (errorMessage?: string) => new CharactersValidator(errorMessage),
	MIN_LENGTH: (value: number, errorMessage?: string) => new MinLengthValidator(value, errorMessage),
	MAX_LENGTH: (value: number, errorMessage?: string) => new MaxLengthValidator(value, errorMessage),
	MIN_VALUE: (value: number, errorMessage?: string) => new MinValueValidator(value, errorMessage),
	MAX_VALUE: (value: number, errorMessage?: string) => new MaxValueValidator(value, errorMessage),
	PHONE: (errorMessage?: string) => new PhoneValidator(errorMessage),
	REQ: (errorMessage?: string) => new RequiredValidator(errorMessage),
	EMAIL: (errorMessage?: string) => new EmailValidator(errorMessage),
	NUM: (type: 'positiveInteger' | 'integer' | 'positiveFloat' | 'float' = 'positiveInteger', errorMessage?: string) =>
		new NumericValidator(errorMessage, type),
	REG: (value: RegExp, errorMessage?: string) => new RegexValidator(value, errorMessage),
	CUSTOM: <T>(value: (value: T) => boolean, errorMessage?: string) => new CustomValidator<T>(value, errorMessage)
};

export default Validators;
