import profanity from './profanity';

/** String related utilities */
export default class StringUtils {
	/**
	 * Convert 24 hour time format to am/pm time format
	 * @param {string | number} time
	 * @returns {string} - Returns a string
	 */
	static convertTwentyFourHourTime(time24: string | number): string {
		const timeString = String(time24).replace(/\s/g, '');
		if (timeString === '') return '';

		if (typeof time24 === 'number') {
			if (time24 >= 24 || time24 < 0) return '';
			const hours = Math.floor(time24);
			const minutes = Math.round((time24 - hours) * 60)
				.toString()
				.padStart(2, '0');
			let ampm = 'AM';
			let hour = hours;
			if (hours >= 12) {
				ampm = 'PM';
				hour = hours - 12;
			}
			if (hour === 0) hour = 12;
			return `${hour}:${minutes} ${ampm}`;
		}

		const timeSplit = time24.split(':');
		if (timeSplit.length !== 2) return '';
		const hours = parseInt(timeSplit[0]);
		if (hours >= 24 || hours < 0) return '';
		const minutes = timeSplit[1];
		let ampm = 'AM';
		let hour = hours;
		if (hours >= 12) {
			ampm = 'PM';
			hour = hours - 12;
		}
		if (hour === 0) hour = 12;
		return `${hour}:${minutes} ${ampm}`;
	}

	/**
	 * Converts 12 hour string to a 24 hour format
	 * @param string in 12 hour format
	 * @returns string in 24 hour format
	 */
	static convertFrom12To24Format(time12: string): string {
		const timeString = String(time12).replace(/\s/g, '');
		if (timeString === '') return '';

		const timeSplit = time12.split(':');
		if (timeSplit.length !== 2) return '';
		const hours = parseInt(timeSplit[0]);
		if (hours >= 24 || hours < 0) return '';
		const minutes = timeSplit[1];
		const ampm = minutes.slice(-2);
		let hour = hours;
		if (ampm === 'PM' && hours < 12) hour = hours + 12;
		if (ampm === 'AM' && hours === 12) hour = hours - 12;
		return `${hour.toString().padStart(2, '0')}:${minutes.slice(0, 2).padStart(2, '0')}`;
	}

	/**
	 * Converts seconds to Hour Min format
	 * @param number of seconds
	 * @returns string 00 hr 00 min
	 */
	static convertFromSecToHrMinFormat(sec: number): string {
		const min = sec / 60;
		const hours = Math.floor(min / 60);
		const minutes = Math.round(min % 60);
		return `${hours} hr ${minutes} min`;
	}

	/**
	 * Converts min to Hour Min format
	 * @param number of minute
	 * @returns string 00 hr 00 min
	 */
	static convertFromMinToHrMinFormat(min: number): string {
		const hours = Math.floor(min / 60);
		const minutes = min % 60;
		return `${hours} hr ${minutes} min`;
	}

	/**
	 * Converts seconds to an array in the format [Hour: string, Minute: string].
	 * @param {string} sec the number of seconds
	 * @returns {[string, string]} Returns an array in the format [Hour: string, Minute: string].
	 **/
	static convertFromSecToHrMinArray(sec: number): [string, string] {
		sec = Math.max(sec, 0);
		const min = sec / 60;
		const hours = Math.floor(min / 60);
		const minutes = Math.floor(min % 60);
		return [hours.toString(), minutes.toString()];
	}

	/**
	 * Returns a 'clean' string with no carriage return, tab or new line and removes all additional spaces
	 * @param {string} value - The string to clean
	 * @returns {string} - Returns the cleaned version of the string
	 */
	static removeLineEndings(value: string): string {
		if (!value) return '';
		const newValue = value
			.replace(/\r?\n|\t|\r/g, ' ') // remove carriage return, new line, and tab
			.match(/[^ ]+/g); // remove extra spaces
		if (newValue) return newValue.join(' ');
		// return to single spaces
		else return '';
	}

	/**
	 * Takes any value and converts it to a string.
	 * Default's to JSON.stringify but will use toString if the output is not an [object Object]
	 * @param {any} value - The value to convert to a string
	 * @returns {string} - Returns the string version of the value
	 */
	static stringify(value: any): string {
		if (!value) return String(value);
		if (value.toString() !== '[object Object]') return value.toString();
		return JSON.stringify(value);
	}

	/**
	 * Capitalizes the first letter
	 * @param {string} value
	 * @returns {string}
	 */
	static capitalizeFirst(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	/**
	 * Converts a semVer string such as 1.2.3 to a number 1 * 1000 * 1000 + 2 * 1000 + 3 = 1_002_003
	 * @param versionString a semVer string not including tag or build
	 * @return a number converted from string
	 * @private
	 */
	static semVerToNumber(versionString: string): number {
		const versionSplit = versionString.split('.');
		let versionValue = 0;
		let versionMultiplier = 1;
		for (let i = versionSplit.length - 1; i >= 0; i--) {
			versionValue = versionValue + parseInt(versionSplit[i]) * versionMultiplier;
			versionMultiplier *= 1000;
		}
		return versionValue;
	}

	/**
	 * Check if input string is a valid URL.
	 * @param {string} test
	 * @returns {boolean} returns true or false
	 * @example
	 * isValidUrl("https://www.google.com") true
	 * isValidUrl("I am an invalid URL string.") false
	 */
	static isValidUrl(test: string): boolean {
		try {
			new URL(test);
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Takes a string and returns it with all non-numeric characters removed
	 * @param {string | number} [value=''] the string to remove non-numeric characters from
	 * @param {boolean} [doesAllowDecimal=false] if true, will allow decimal points
	 * @param {boolean} [doesAllowNegative=false] if true, will allow negative numbers
	 * @returns {string} the string with all non-numeric characters removed
	 */
	static removeNonNumeric(
		value: string | number | null = '',
		doesAllowDecimal: boolean = false,
		doesAllowNegative: boolean = false
	): string {
		let newValue = String(value).replace(/[^0-9.-]|(?<=[0-9])-(?=[0-9])|(?<=-.*?)-|(?<=\..*?)\./g, '');

		if (!doesAllowDecimal) newValue = newValue.replace(/\./g, '');
		if (!doesAllowNegative) newValue = newValue.replace(/-/g, '');

		if (newValue === '') return '';
		if (newValue === '-') return '-';
		if (newValue === '.') return '0.';
		if (newValue === '-.') return '-0.';

		return newValue;
	}

	/**
	 * Convert an integer to base36 string
	 * @param {number} int
	 * @returns {string}
	 * @example
	 * const result = intToBase36(10);
	 */
	static intToBase36(int: number): string {
		return int.toString(36).padStart(8, '0').toUpperCase();
	}

	/**
	 * Format number to currency format
	 * @param {number} money
	 * @returns {string}
	 */
	static formatMoney(money: number): string {
		let n: any = money / 100,
			c = 2,
			d = '.',
			t = ',',
			s = n < 0 ? '-' : '',
			i: any = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))));
		// eslint-disable-next-line
		var j: number = (j = i.length) > 3 ? j % 3 : 0;
		return (
			s +
			(j ? i.substr(0, j) + t : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
			(d +
				Math.abs(n - i)
					.toFixed(c)
					.slice(2))
		);
	}

	/**
	 * Copy HTML input text
	 * @param {string} id
	 * @returns {void}
	 */
	static copyText(id: string): void {
		const copyText = document.getElementById(id) as HTMLInputElement;
		if (!('select' in copyText && typeof copyText.select === 'function')) return;
		copyText.select();
		document.execCommand('Copy');
	}

	/**
	 * Copy value to clipboard
	 * @param {string} value
	 * @returns {void}
	 */
	static copyToClipboard(value: string): void {
		if (
			'plugins' in window &&
			!!window.plugins &&
			typeof window.plugins === 'object' &&
			'clipboard' in window.plugins &&
			!!window.plugins.clipboard &&
			typeof window.plugins.clipboard === 'object' &&
			'copy' in window.plugins.clipboard &&
			typeof window.plugins.clipboard.copy === 'function'
		) {
			window.plugins.clipboard.copy(value);
		} else {
			const el = document.createElement('textarea');
			if (!el) return;
			el.value = value;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
	}

	/**
	 * Check if it is an empty string
	 * @param {unknown} value
	 * @returns {boolean}
	 */
	static isEmpty(value: unknown): boolean {
		if (value === null) return true;
		if (value === undefined) return true;
		if (value === '') return true;
		return false;
	}

	/**
	 * Format string to price range string
	 * @param {string} input
	 * @returns {string}
	 */
	static formatPriceRange(input: string): string {
		if (!input) return '';
		const start = Number(input.split('-').at(0)) ?? 0;
		const end = Number(input.split('-').at(-1)) ?? 0;
		const startString = StringUtils.formatMoney(start);
		const endString = StringUtils.formatMoney(end);
		if (!start && end) return `$${endString}`;
		if (!end && start) return `$${startString}`;
		if (start === end) return `$${startString}`;
		return `$${startString}-$${endString}`;
	}

	/**
	 * Check if input is a boolean type
	 * @param {unknown} bool
	 * @returns {boolean}
	 */
	static isBoolean(bool: unknown): boolean {
		if (bool === !!bool) return true;
		return false;
	}

	/**
	 * Checks to see if the regex express passes on the given value
	 * @param {RegExp} regex - The regular expression to run on the value
	 * @param {string} value - A string value to check with the regular express
	 * @returns {boolean} - Returns true if the matching pattern was found
	 */
	static testRegex(regex: RegExp, value: string): boolean {
		regex = new RegExp(regex);
		return regex.test(value);
	}

	/**
	 * Generate a unique GUID
	 * @returns {string} - Returns a string unique GUID
	 * */
	static generateGuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	/**
	 * Filter out profanity from input text
	 * @param {string} text
	 * @returns {string}
	 */
	static filterProfanity(text: string): string {
		const punctuationRegex = new RegExp(/[\n\t!.,']/g);
		const profaneRegex = new RegExp(
			`${profanity
				.map((word) => word.replace(punctuationRegex, '').replace(/[-/\\^$*+?.()|[\]{}]/gu, '\\$&'))
				.join('|')}`,
			'gi' // gi = global, case insensitive
		);

		const punctuationFreeWord = text.replace(punctuationRegex, '');
		if (!profaneRegex.test(punctuationFreeWord)) return text;

		const removedPunctuationSpots = StringUtils.getRemovedPositions(text, punctuationFreeWord);
		const censoredWord = Array.from(
			punctuationFreeWord.replace(profaneRegex, (match) => '🤬'.repeat(match.length))
		);

		let newWordIndex = 0;
		let wordIndex = 0;
		let result = '';
		while (newWordIndex <= punctuationFreeWord.length) {
			if (removedPunctuationSpots.includes(newWordIndex + wordIndex)) {
				result += text[newWordIndex + wordIndex];
				wordIndex++;
				continue;
			}

			const p = censoredWord.at(newWordIndex);
			if (!!p) result += p;
			newWordIndex++;
		}

		return result.replace(/(🤬)+/g, '🤬');
	}

	/**
	 * Converts snake case into regular text that is upper cased
	 * @param {string} snakeCase
	 * @returns {string}
	 */
	static snakeCaseToHuman(snakeCase: string): string {
		if (snakeCase.constructor !== String || snakeCase === '') return '';
		let humanize = snakeCase.split('_');
		for (let i = 0; i < humanize.length; i++) {
			humanize[i] = humanize[i][0].toUpperCase() + humanize[i].substr(1);
		}
		return humanize.join(' ');
	}

	/**
	 * Adds commas to a string number or regular number
	 * @param {string | number} num - The number to add commas to
	 * @returns {string} - a string with commas added.
	 * or an empty string if the input is not a number
	 */
	static addCommasToNumber(num: string | number): string {
		if (isNaN(Number(num))) return '';
		const parts = String(num).split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		num = parts.join('.');

		return num;
	}

	/**
	 * Removes HTML Tags from string
	 * @param {string} html
	 * @returns {string}
	 */
	static removeHtmlTags(html: string): string {
		if (!html) return '';
		return html.replace(/(<([^>]+)>)/gi, '');
	}

	/**
	 * Removes Incorrect String Values (Emojis) from string
	 * @param {string} string
	 * @returns {string}
	 */
	static removeIncorrectStringValues(string: string): string {
		if (!string) return '';
		const incorrectStringRegex = new RegExp(/[^\p{L}\p{N}\p{P}\p{Z}]/gu);
		const splitWords = string.split(' ');
		const newWords: string[] = [];
		splitWords.forEach((word) => {
			const newWord = word.replace(incorrectStringRegex, '');
			if (!newWord || newWord === '') return;
			newWords.push(newWord);
		});

		return newWords.join(' ');
	}

	/**
	 * Formats a phone number from a string or a numerical string
	 * @param phone Example "8013615555
	 * @returns string Formatted number Ex (801) 361-5555
	 */
	static formatPhoneNumber(phone: string | number | null = ''): string {
		const cleaned = String(phone).replace(/\D/g, '');
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

		if (!!match) return `(${match[1]}) ${match[2]}-${match[3]}`;
		else return cleaned;
	}

	/**
	 * Removes international code from phone number to get the last 10 digits
	 * Runs `formatPhoneNumber` on the cleaned digits
	 * @param phone Phone number with or without international code
	 * @returns {string} Formatted phone number if can be formatted, otherwise returns the phone number as is
	 */
	static formatInternationalPhoneNumber(phone: string | number | null = ''): string {
		const digitsOnly = String(phone).replace(/\D/g, '');

		// Check if the remaining digits form standard 10 digit phone number
		if (digitsOnly.length === 10) return StringUtils.formatPhoneNumber(digitsOnly);
		// If the phone has more than 10 digits, assume it includes international code
		if (digitsOnly.length > 10) return StringUtils.formatPhoneNumber(digitsOnly.slice(-10));
		// If the phone does not have 10 digits, return it as is
		return String(phone);
	}

	/**
	 * Takes out all non-numeric characters from a string.
	 * Then checks if the length is equal to the length parameter
	 * @param text string to be validated
	 * @param length length of the string to be validated
	 * @returns {boolean} true if the string is a number and the length is equal to the length parameter
	 */
	static validateNumberLength(text: string, length: number): boolean {
		const cleanedArray = ('' + text).match(/\d+/g);
		const cleaned = cleanedArray && cleanedArray.length > 0 ? cleanedArray.join('') : '';
		return cleaned.length === length;
	}

	/**
	 * Returns all characters from a string that is not a number
	 * @param {string} string - String with mix numbers, characters
	 * @returns {string} string with only numbers
	 */
	static removeAllExceptNumbers(string: string): string {
		if (!string) return '';
		return string.replace(/\D+/g, '');
	}

	/**
	 * Prefixes 0 to the front of a double digit like Month
	 * @param {string | number} text string to be prefixed
	 * @returns {string} string with zero prefixes
	 */
	static doubleDigit(text: string | number): string {
		return String(text).padStart(2, '0');
	}

	/**
	 * Returns the indexes of the changed characters.
	 * If the length of the strings are different, it will return an empty array
	 * @param {string} originalValue The original value
	 * @param {string} updatedValue The updated value
	 * @returns {number[]} An array of the indexes of the changed characters
	 */
	static getChangedIndexes(originalValue: string, updatedValue: string): number[] {
		const changedIndexes: number[] = [];
		if (originalValue.length !== updatedValue.length) return changedIndexes;
		for (let i = 0; i < originalValue.length; i++) if (originalValue[i] !== updatedValue[i]) changedIndexes.push(i);
		return changedIndexes;
	}

	/**
	 * Calculates the cursor offset based on the original value and the updated value
	 * @param {number} startPosition The current cursor position
	 * @param {string} updatedValue The updated value
	 * @param {string} originalValue The original value
	 * @returns {number} the calculated cursor offset
	 */
	static getCursorOffset(startPosition: number, updatedValue: string, originalValue: string): number {
		let cursorOffset = 0;
		if (updatedValue.length !== originalValue.length) {
			// Find what was changed between the cursor position and the start of the string
			if (updatedValue.length > originalValue.length) {
				// If there was an insertion before the startPosition, change cursor offset by 1 and increase the startPosition by 1
				const insertions = StringUtils.getInsertedPositions(originalValue, updatedValue);
				for (let i = 0; i < insertions.length; i++)
					if (insertions[i] < startPosition) {
						startPosition++;
						cursorOffset++;
					}
			} else {
				// If there was a removal before the startPosition, change cursor offset by -1
				const removals = StringUtils.getRemovedPositions(originalValue, updatedValue);
				for (let i = 0; i < removals.length; i++)
					if (removals[i] < startPosition) {
						cursorOffset--;
					}
			}
		}
		return cursorOffset;
	}

	/**
	 * Returns the positions of the inserted characters
	 * @param {string} originalValue The original value
	 * @param {string} updatedValue The updated value
	 * @returns {number[]} An array of the positions of the inserted characters
	 */
	static getInsertedPositions(originalValue: string, updatedValue: string): number[] {
		const insertions: number[] = [];
		let originalValueIndex = 0;

		for (let i = 0; i < updatedValue.length; i++)
			if (originalValue[originalValueIndex] !== updatedValue[i]) insertions.push(i);
			else originalValueIndex++;

		return insertions;
	}

	/**
	 * Returns the positions of the removed characters
	 * @param {string} originalValue The original value
	 * @param {string} updatedValue The updated value
	 * @returns {number[]} An array of the positions of the removed characters
	 */
	static getRemovedPositions(originalValue: string, updatedValue: string): number[] {
		const removals: number[] = [];
		let updatedValueIndex = 0;

		for (let i = 0; i < originalValue.length; i++)
			if (updatedValue[updatedValueIndex] !== originalValue[i]) removals.push(i);
			else updatedValueIndex++;

		return removals;
	}
}
