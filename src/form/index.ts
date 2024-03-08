/**
 * @module form
 * formControl
 * formGroup
 * formValidator
 * validators
 */

export { default as formControl } from './FormControl';
export { default as formGroup } from './FormGroup';
export { default as FormValidator } from './FormValidator';

export {
	default as Validators,
	CharactersValidator,
	EmailValidator,
	MaxLengthValidator,
	MaxValueValidator,
	MinLengthValidator,
	MinValueValidator,
	NumericValidator,
	PhoneValidator,
	RegexValidator,
	RequiredValidator
} from './Validators';
