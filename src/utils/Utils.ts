import cloneDeep from 'lodash.clonedeep';
import profanity from './profanity';

declare const window: any;
// declare global {
// 	interface Date {
// 		getWeekOfMonth(): number;
// 	}
// }

interface RsResponseData<T> {
	data: T;
}

// eslint-disable-next-line no-extend-native
Date.prototype.getWeekOfMonth = function () {
	var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
	var offsetDate = this.getDate() + firstWeekday - 1;
	return Math.floor(offsetDate / 7);
};
export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** String related utilities */
export class StringUtils {
	/**
	 * Convert 24 hour time format to am/pm time format
	 * @param {string | number} time
	 * @returns {string} - Returns a string
	 */
	static convertTwentyFourHourTime(time: string | number): string {
		if (!time) return '';

		let sanitizedTime: number = parseInt(time.toString().replace(/\D+/g, ''));
		if (sanitizedTime > 1259) {
			sanitizedTime = sanitizedTime - 1200;
			if (sanitizedTime.toString().length === 3) {
				let minutes = sanitizedTime.toString().slice(-2);
				let hour = sanitizedTime.toString().slice(0, 1);
				return `${hour}:${minutes} PM`;
			} else if (sanitizedTime.toString().length === 4) {
				let minutes = sanitizedTime.toString().slice(-2);
				let hours = sanitizedTime.toString().slice(0, 2);
				return `${hours}:${minutes} PM`;
			} else {
				return '';
			}
		}
		if (sanitizedTime.toString().length === 3) {
			let minutes = sanitizedTime.toString().slice(-2);
			let hour = sanitizedTime.toString().slice(0, 1);
			return `${hour}:${minutes} AM`;
		} else if (sanitizedTime.toString().length === 4) {
			let minutes = sanitizedTime.toString().slice(-2);
			let hours = sanitizedTime.toString().slice(0, 2);
			return `${hours}:${minutes} ${hours === '12' ? 'PM' : 'AM'}`;
		} else {
			return '';
		}
	}

	/**
	 * Converts 12 hour string to a 24 hour format
	 * @param string in 12 hour format
	 * @returns string in 24 hour format
	 */
	static convertFrom12To24Format(time12: string): string {
		const time = time12.match(/([0-9]{1,2}):([0-9]{2})(am|pm)/)?.slice(1);
		if (time) {
			const PM = time[2] === 'pm';
			const hours = (+time[0] % 12) + (PM ? 12 : 0);

			return `${('0' + hours).slice(-2)}:${time[1]}`;
		}
		return time12;
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
	 * @name removeLineEndings
	 * @param {string} value - The string to clean
	 * @returns {string} - Returns the cleaned version of the string
	 */
	static removeLineEndings(value: string): string {
		if (!value) return '';
		let newValue = value
			.replace(/\r?\n|\t|\r/g, ' ') // remove carriage return, new line, and tab
			.match(/[^ ]+/g); // remove extra spaces
		if (newValue) return newValue.join(' ');
		// return to single spaces
		else return '';
	}

	/**
	 * Capitalizes the first letter
	 * @name capitalizeFirst
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
		let versionSplit = versionString.split('.');
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
	 * @name isValidUrl
	 * @param {string} test
	 * @returns {boolean} returns true or false
	 * @example
	 * isValidUrl("https://www.google.com") true
	 * isValidUrl("I am an invalid URL string.") false
	 */
	static isValidUrl(test: string) {
		try {
			new URL(test);
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Convert an integer to base36 string
	 * @name intToBase36
	 * @param {number} int
	 * @returns {string}
	 * @example
	 * const resilt = intToBase36(10);
	 */
	static intToBase36(int: number) {
		return int.toString(36).padStart(8, '0').toUpperCase();
	}

	/**
	 * Format number to currency format
	 * @name formatMoney
	 * @param {number} money
	 * @returns {string}
	 */
	static formatMoney(money: number) {
		var n: any = money / 100,
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
	 * @name copyText
	 * @param {string} id
	 * @returns {void}
	 */
	static copyText(id: string) {
		let copyText = document.getElementById(id) as HTMLInputElement;
		copyText.select();
		document.execCommand('Copy');
	}

	/**
	 * Copy value to clipboard
	 * @name copyToClipboard
	 * @param {string} value
	 * @returns {void}
	 */
	static copyToClipboard(value: string) {
		if (
			WebUtils.isCordova() &&
			window.cordova.plugins &&
			window.plugins.clipboard &&
			window.plugins.clipboard.copy
		) {
			window.plugins.clipboard.copy(value);
		} else {
			const el = document.createElement('textarea');
			el.value = value;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
	}

	/**
	 * Check if it is an empty string
	 * @name isEmpty
	 * @param {string} value
	 * @returns {boolean}
	 */
	static isEmpty(value: string) {
		if (value === null) return true;
		if (value === undefined) return true;
		if (value === '') return true;
		return false;
	}

	/**
	 * Format string to price range string
	 * @name formatPriceRange
	 * @param {string} input
	 * @returns {string}
	 */
	static formatPriceRange(input: string) {
		if (!input) return '-';
		let start = parseInt(input.split('-')[0]) / 100 || '';
		let end = parseInt(input.split('-')[1]) / 100 || '';
		if (!start && end) return `$${end}`;
		if (!end && start) return `$${start}`;
		if (start === end) return `$${start}`;
		return `$${start}-$${end}`;
	}

	/**
	 * Check if input is a boolean type
	 * @name isBoolean
	 * @param {any} bool
	 * @returns {boolean}
	 */
	static isBoolean(bool: any) {
		if (bool === !!bool) return true;
		return false;
	}

	/**
	 * Checks to see if the regex express passes on the given value
	 * @name testRegex
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
	 * @name generateGuid
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
		const filterWord = (word: string) => {
			let punctuationFreeWord = filterOutPunctuation(word);
			if (!profanity.includes(punctuationFreeWord)) {
				return word;
			}
			let newWord = word.replace(punctuationFreeWord, '🤬');
			if (newWord === word) {
				newWord = '🤬';
			}
			return newWord;
		};

		const filterOutPunctuation = (word: string) => {
			return word
				.replace('\n', '')
				.replace('\t', '')
				.replace(/!/g, '')
				.replace(/\./g, '')
				.replace(/,/g, '')
				.replace(/'/g, '')
				.replace(/'/g, '')
				.toLowerCase();
		};

		const words = text.split(' ');
		const newMessage = [];
		for (let i in words) {
			const newWord = filterWord(words[i]);
			newMessage.push(newWord);
		}
		return newMessage.join(' ');
	}

	/**
	 * Converts snake case into regular text that is upper cased
	 * @param {string} snakeCase
	 * @returns {string}
	 */
	static snakeCaseToHuman(snakeCase: string) {
		if (snakeCase.constructor !== String || snakeCase === '') return '';
		let humanize = snakeCase.split('_');
		for (let i = 0; i < humanize.length; i++) {
			humanize[i] = humanize[i][0].toUpperCase() + humanize[i].substr(1);
		}
		return humanize.join(' ');
	}

	/**
	 * Adds commas to a string number or regular number
	 * @param {string || number} intNum
	 * @returns {string}
	 */
	static addCommasToNumber(intNum: any) {
		if (isNaN(intNum)) return intNum;
		return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
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
		return string.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
	}

	/**
	 * Formats a phone number from a string or a numerical string
	 * @param phone Example "8013615555
	 * @returns string Formatted number Ex (801) 361-5555
	 */
	static formatPhoneNumber(phone: string | number): string {
		let cleaned = ('' + phone).replace(/\D/g, '');
		let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		} else {
			return cleaned;
		}
	}

	static validateNumberLength(text: string, length: number) {
		let cleanedArray = ('' + text).match(/\d+/g);
		let cleaned = cleanedArray && cleanedArray.length > 0 ? cleanedArray.join('') : '';
		return cleaned.length === length;
	}

	/**
	 * Returns all characters from a string that is not a number
	 * @param string - String with mix numbers, characters
	 * @returns string with only numbers
	 */
	static removeAllExceptNumbers(string: string): string {
		if (!string) return '';
		return string.replace(/\D+/g, '');
	}

	/**
	 * Prefixes 0 to the front of a double digit like Month
	 * @param text string to be prefixed
	 * @returns string with zero prefixes
	 */
	static doubleDigit(text: string): string {
		if (text.length === 1) return '0' + text;
		if (text.length === 0) return '00';
		return text;
	}

	/**
	 * Calculates the cursor offset based on the original value and the updated value
	 * @param startPosition The current cursor position
	 * @param updatedValue The updated value
	 * @param originalValue The original value
	 * @returns the calculated cursor offset
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
	 * @param originalValue The original value
	 * @param updatedValue The updated value
	 * @returns An array of the positions of the inserted characters
	 */
	static getInsertedPositions(originalValue: string, updatedValue: string): number[] {
		const insertions = [];
		let originalValueIndex = 0;

		for (let i = 0; i < updatedValue.length; i++)
			if (originalValue[originalValueIndex] !== updatedValue[i]) insertions.push(i);
			else originalValueIndex++;

		return insertions;
	}

	/**
	 * Returns the positions of the removed characters
	 * @param originalValue The original value
	 * @param updatedValue The updated value
	 * @returns An array of the positions of the removed characters
	 */
	static getRemovedPositions(originalValue: string, updatedValue: string): number[] {
		const removals = [];
		let updatedValueIndex = 0;

		for (let i = 0; i < originalValue.length; i++)
			if (updatedValue[updatedValueIndex] !== originalValue[i]) removals.push(i);
			else updatedValueIndex++;

		return removals;
	}
}

/** Number related utilities */
export class NumberUtils {
	/**
	 * @name dollarsToCents
	 * @param {dollars} The floating point dollar value
	 * @returns {number} The integer number of cents
	 */
	static dollarsToCents(dollars: number): number {
		return parseInt((dollars * 100).toFixed(0));
	}

	/**
	 * centsToDollars
	 * @param {number} cents - cent dollar value
	 * @returns {number} floating point dollar value
	 */
	static centsToDollars(cents: number): number {
		return parseFloat((cents / 100).toFixed(2));
	}

	/**
	 * round - Rounds a number to significance
	 * @param {number } num
	 * @param {number} significance
	 * @returns {number} number moved to relative significance
	 */
	static round(num: number, significance: number): number {
		if (num === 0) return 0;
		const sign = Math.sign(num);
		num = Math.abs(num);
		significance = Math.abs(Math.trunc(significance));
		const mod = num % significance;
		if (mod === 0) {
			return num;
		}
		return sign * (num - mod + significance);
	}
}

/** Object related utilities */
export class ObjectUtils {
	/**
	 * Dedupe an array of tables with a compound key
	 * @param {any[]} dataset - an array of tables
	 * @param {...string[]} properties - property string you wish to dedupe on
	 * @returns {any[]} - Deduped version of the original dataset
	 */
	static multiPropDedupe<T extends Object>(dataset: T[], ...properties: string[]): T[] {
		if (properties.length === 0) return dataset;
		const values: T[] = [];
		for (let data of dataset) {
			if (
				values.some(function (obj: any) {
					for (let prop of properties) {
						//@ts-ignore
						if (data[prop] !== obj[prop]) return false;
					}
					return true;
				})
			)
				continue;
			values.push(data);
		}
		return values;
	}

	/**
	 *
	 * @param data - the array to paginate
	 * @param page - which page of data to return
	 * @param perPage - number of items per page
	 * @returns - a new array made up of the page of data from the original array
	 */
	static paginateArray<T>(data: T[], page: number, perPage: number): T[] {
		const offset = page * perPage - perPage;
		return data.slice(offset, page * perPage);
	}

	/**
	 * Filters an array in place
	 * Based on the answer here https://stackoverflow.com/a/57685728
	 * @param array The array to filter
	 * @param condition The filter criteria
	 * @returns An array of the elements removed
	 */
	static filterInPlace<T>(array: T[], condition: (value: T) => boolean): T[] {
		let next_place = 0;
		const removed: T[] = [];

		for (let value of array) {
			if (condition(value)) array[next_place++] = value;
			else removed.push(value);
		}

		array.splice(next_place);
		return removed;
	}

	/**
	 * Syntactic sugar for force casting a variable
	 * @param obj
	 * @returns
	 */
	static forceCast<T>(obj: any): T {
		return obj as unknown as T;
	}

	/**
	 * Returns a base object either through JSON.parse or a clone of the original object
	 * @name safeParse
	 * @param json
	 * @returns {object} - Returns a json object of the stringified object
	 */
	static safeParse(json: any): object | any {
		if (!json) return {};
		try {
			return JSON.parse(json);
		} catch (e) {
			return this.clone(json);
		}
	}

	/**
	 * Deep value replace for object
	 * @name deepValueReplace
	 * @param {any} entity
	 * @param {string} search
	 * @param {string} replacement
	 * @returns {object}
	 * @example
	 * deepValueReplace(
	 *  {a:"red",b: {b1:"blue",b2:"red"},c:{c1:{c11:"red"}}},
	 *  "red",
	 *  "yellow"
	 * )
	 */
	static deepValueReplace(entity: any, search: string, replacement: string) {
		var newEntity: typeof entity = {},
			regExp = new RegExp(search, 'g');
		for (var property in entity) {
			if (!entity.hasOwnProperty(property)) {
				continue;
			}

			var value = entity[property],
				newProperty = property;
			if (typeof value === 'object') {
				value = ObjectUtils.deepValueReplace(value, search, replacement);
			} else if (typeof value === 'string') {
				value = value.replace(regExp, replacement);
			}

			newEntity[newProperty] = value;
		}

		return newEntity;
	}

	/**
	 * Check if it is an empty object
	 * @name isEmptyObject
	 * @param {object} obj
	 * @returns {boolean}
	 */
	static isEmptyObject(obj: object) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	}

	/**
	 * Tests if passed in value is an object and is not null
	 * @param credentials
	 */
	static isObject(obj: any): boolean {
		return typeof obj === 'object' && obj !== null;
	}

	/**
	 * Serialize an object to query string
	 * @name serialize
	 * @param {any} obj
	 * @returns {string}
	 */
	static serialize(obj: any) {
		let str = [];
		for (let p in obj)
			if (obj.hasOwnProperty(p)) {
				if (obj[p] instanceof Array) {
					let concatArray: any = [];
					for (let i = 0; i < obj[p].length; i++) {
						concatArray.push(encodeURIComponent(p) + '[]=' + encodeURIComponent(obj[p][i]));
					}
					concatArray = concatArray.join('&');
					str.push(concatArray);
				} else if (obj[p] instanceof Object) {
					str.push(encodeURIComponent(p) + '=' + JSON.stringify(obj[p]));
				} else {
					str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
				}
			}
		return str.join('&');
	}

	/**
	 * Convert server object to client object
	 * @name serverToClientObj
	 * @param {any} object
	 * @param {any} metadata
	 * @returns {any}
	 */
	static serverToClientObj(object: any, metadata: any) {
		const meta = metadata ?? null;
		const obj = cloneDeep(object);
		if (obj && Array.isArray(obj)) {
			for (let j in obj) {
				for (let i in meta) {
					if (obj[j][i] !== undefined) {
						obj[j][i] = ObjectUtils.serverToClientProperty(obj[j][i], meta[i]);
					}
				}
			}
		} else {
			for (let i in meta) {
				if (obj[i] !== undefined) {
					obj[i] = ObjectUtils.serverToClientProperty(obj[i], meta[i]);
				}
			}
		}
		return obj;
	}

	static serverToClientProperty(property: any, metadata: any) {
		if (metadata.type === 'date') {
			property = DateUtils.serverToClientDate(property);
		} else if (metadata.type === 'datetime') {
			property = DateUtils.serverToClientDateTime(property);
		}
		return property;
	}

	/**
	 * Convert client object to server object
	 * @name clientToServerObj
	 * @param {any} obj
	 * @param {any} metadata
	 * @returns {any}
	 */
	static clientToServerObj(obj: any, metadata: any) {
		const meta = metadata ?? null;
		let object = cloneDeep(obj);
		if (!meta) {
			for (let i in object) {
				if (DateUtils.isClientDate(object[i])) {
					object[i] = DateUtils.clientToServerDateTime(object[i]);
				} else if (StringUtils.isBoolean(object[i])) {
					object[i] = object[i] ? 1 : 0;
				}
			}
		}
		if (object && Array.isArray(object)) {
			for (var j in object) {
				for (let i in meta) {
					if (object[j][i]) {
						object[j][i] = ObjectUtils.clientToServerProperty(object[j][i], meta[i]);
					}
				}
			}
		} else {
			for (let i in meta) {
				object[i] = ObjectUtils.clientToServerProperty(object[i], meta[i]);
			}
		}
		return object;
	}

	static clientToServerProperty(property: any, metadata: any) {
		if (metadata.type === 'date') {
			return DateUtils.clientToServerDate(property);
		} else if (metadata.type === 'datetime') {
			return DateUtils.clientToServerDateTime(property);
		} else if (metadata.type === 'related' && property === '') {
			return null;
		} else if (metadata.type === 'boolean') {
			return property ? 1 : 0;
		}
		return property;
	}

	/**
	 * Converts values of an obj (key/value pair) to a array.
	 * @name toArray
	 * @param {any} obj - The object to convert
	 * @returns {Array<T>}
	 */
	static toArray<T>(obj: any) {
		const res: T[] = [];
		for (let i in obj) {
			res.push(obj[i]);
		}
		return res;
	}

	/**
	 * Converts an array to an object or resorts an object using a new key.
	 * @name toObject<T>
	 * @param {Array<T>} array - The array or object to have mapped
	 * @param {keyof T} property - The property to use as the new key
	 * @returns {Object}
	 */
	static toObject<T>(array: T[], property: keyof T) {
		let res: any = {};
		for (let i in array) {
			if (array[i] === null) continue;
			res[array[i][property]] = array[i];
		}
		return res;
	}

	/**
	 * Updates an the properties of an object based on a new objects properties and values
	 * @name update<T>
	 * @param {T} obj - The object to update
	 * @param {T} newObj - The new object to use as the updates
	 * @returns {T}
	 */
	static update<T>(obj: T, newObj: T) {
		for (let i in newObj) {
			obj[i] = newObj[i];
		}
		return obj;
	}

	/**
	 * Sorts an object or array based on a property and direction
	 * @name sort
	 * @param dataset - The dataset to sort
	 * @param property - The property to sort by
	 * @param reverse - Sort in reverse direction
	 */
	static sort<T>(dataset: T[], property: keyof T, reverse: boolean) {
		let sortOrder = 1;
		if (reverse) {
			sortOrder = -1;
		}
		const compare = function (a: T, b: T) {
			let result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
			return result * sortOrder;
		};

		dataset.sort(compare);
		return dataset;
	}

	/**
	 * Determines if an object is empty or not
	 * @name isEmpty
	 * @param {any} obj - The dataset to check
	 * @returns {boolean}
	 */
	static isEmpty(obj: any) {
		for (let i in obj) {
			return false;
		}
		return true;
	}

	/**
	 * Get the length of an object by counting its keys
	 * @name getObjectLength
	 * @param {any} obj
	 * @returns {number}
	 */
	static getObjectLength(obj: any) {
		return Object.keys(obj).length;
	}

	/**
	 * Returns the stripped off data object from a standard database response
	 * @name toData
	 * @param {object} - A standard RsResponseData from the database layer
	 * @returns {object} - Returns the base object nested within the RsResponseData
	 */
	static toData<T>(obj: RsResponseData<T>): T | RsResponseData<T> {
		if (obj && (obj.data || (typeof obj.data === 'boolean' && obj.data === false))) {
			return obj.data;
		}
		return obj;
	}

	/**
	 * Returns a base object either through JSON.parse or on failure the original item is returned
	 * @name smartParse
	 * @param json
	 * @returns {object} - Returns a json object of the stringified object
	 */
	static smartParse(json: any): object | any {
		if (!json) return {};
		try {
			return JSON.parse(json);
		} catch (e) {
			return json;
		}
	}

	/**
	 * Returns a boolean to determine if the value is an array and that array contains data
	 * @name isArrayWithData
	 * @param {any}
	 * @returns {boolean} - Returns a boolean value
	 * */
	static isArrayWithData(possibleArray: any): possibleArray is any[] {
		return !!(possibleArray && Array.isArray(possibleArray) && possibleArray.length > 0);
	}

	/**
	 * Groups a dataset by a property.
	 * @param dataset - The dataset to group
	 * @param property - The property to group by
	 * @returns {Object}
	 */
	static group(dataset: any[], property: string) {
		let res: any = {};
		for (let i in dataset) {
			if (!res[dataset[i][property]]) res[dataset[i][property]] = [];

			res[dataset[i][property]].push(dataset[i]);
		}
		return res;
	}

	/**
	 * Filter an object down to specific field list
	 * @param obj {Object} - A given object you wish to filter over
	 * @param fields {string[]} - An array of columns(keys) wished to return from object
	 * @returns {Object}
	 * */
	static filterObject(obj: any, fields: string[]) {
		for (let i in obj) {
			if (fields.includes(i)) continue;
			delete obj[i];
		}
		return obj;
	}

	/**
	 * Same as Clone, kept for backwards compatibility
	 * @param {Object} obj - Any object you wish to have a deep copy of
	 * @returns {Object}
	 * */
	static copy(obj: any) {
		return cloneDeep(obj);
	}

	/**
	 * Performs a deep clone of an object
	 * @param {Object} obj - Any object you wish to have a deep copy of
	 * @returns {Object}
	 * */
	static clone(obj: any) {
		return cloneDeep(obj);
	}

	/**
	 * Cast a value to a boolean value
	 * @param data - Any value that you want to actually evaluate to a boolean value
	 * @return {boolean}
	 */
	static toBoolean(data: any) {
		return !!!(data === 'false' || !data);
	}

	/**
	 * Dedupe an array of objects
	 * @param {any[]} dataset - an array of objects
	 * @param {string} property - property string you wish to dedupe on
	 * @returns {any[]} - Deduped version of the original dataset
	 */
	static dedupe(dataset: any[], property: string) {
		const res = [];
		const existsValue: any[] = [];
		for (let data of dataset) {
			if (existsValue.includes(data[property])) continue;
			res.push(data);
			existsValue.push(data[property]);
		}
		return res;
	}

	/**
	 * Sort the attributes of an object to return ASC
	 * @param {any} dataset - any singular object
	 * @returns {any} - Returns the given object with values sorted ASC order
	 */
	static simpleSort(dataset: any) {
		return Object.keys(dataset)
			.sort()
			.reduce(
				(accumulator, key) => ({
					...accumulator,
					[key]: dataset[key]
				}),
				{}
			);
	}
}

/** Region utilities */
export class RegionUtils {}

/** Web development utilities */
export class WebUtils {
	/**
	 * it wraps whatever function provided as a promise
	 * @param fn: a function.
	 * @returns a function.
	 */
	static wrapAsync<T, U = any>(fn: any) {
		return (req: U, res: T, next: any) => {
			// Make sure to `.catch()` any errors and pass them along to the `next()`
			// middleware in the chain, in this case the error handler.
			fn(req, res, next).catch(next);
		};
	}

	/**
	 * Returns the object with a list of fields removed, of a type without those fields
	 * @param arg - an object or array of tables to sanitize
	 * @param remove - an array of property names or indices to remove
	 * @returns {any} - the sanitized object or array
	 */
	static sanitize<T, U extends string | number>(arg: T, remove: U[]): Omit<T, U> {
		const result: any = { ...arg };
		for (let key of remove) {
			delete result[key];
		}
		return result;
	}

	/**
	 * Returns a random number within the range of 0 and your input value
	 * @param {number} value - Max range input
	 * @returns {number} a random number between 0 and your max input value
	 */
	static randomNumberInRange(maxLimit: number): number {
		return Math.floor(Math.random() * Math.floor(maxLimit));
	}

	/**
	 * Get axios error message properly based on error type
	 * @param error - the axios error from the catch()
	 */
	static getAxiosErrorMessage(error: any): string {
		let errorResponse = '';
		if (error.response && error.response.data) {
			if (typeof error.response.data === 'object') {
				if ('msg' in error.response.data) errorResponse = error.response.data.msg;
				else errorResponse = JSON.stringify(error.response.data);
			} else if (typeof error.response.data === 'string') errorResponse = error.response.data;
			else errorResponse = 'unknown error message';
		} else if (error.request) {
			errorResponse = error.request.message || error.request.statusText;
		} else {
			errorResponse = error.message;
		}
		return errorResponse;
	}

	/**
	 * Check if all images have been loaded
	 * @name imagesLoaded
	 * @param {HTMLElement} parentNode
	 * @returns {boolean}
	 */
	static imagesLoaded(parentNode: HTMLElement) {
		const imgElements = parentNode.querySelectorAll('img');
		for (let i = 0; i < imgElements.length; i += 1) {
			const img = imgElements[i];
			if (!img.complete) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if it is in cordova app envrionment
	 * @name isCordova
	 * @returns {boolean}
	 */
	static isCordova() {
		let isCordovaApp =
			document.URL.indexOf('http://') === -1 &&
			document.URL.indexOf('https://') === -1 &&
			document.URL.indexOf('localhost:300') === -1;
		return isCordovaApp || window.cordvoa;
	}

	/**
	 * Get app platform name
	 * @name getPlatform
	 * @returns {string}
	 */
	static getPlatform() {
		let platformId = 'web';
		if (window.cordova) {
			platformId = window.cordova.platformId;
		}
		return platformId;
	}

	/**
	 * Strips off all subdomains and returns just the base domain
	 * @name getDomain
	 * @param {string} url - A url to parse such as truvision.ontrac.io
	 * @returns {string} - The stripped domain such as "ontrac.io"
	 */
	static getDomain(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (url.indexOf('http') === -1) url = 'http://' + url;
		let hostname = new URL(url).hostname;
		if (hostname.includes('ontrac')) {
			return hostname.split('.')[0];
		}
		// Remove all subdomains
		let hostnameSplit = hostname.split('.').slice(-2);
		return hostnameSplit.join('.');
	}

	/**
	 * Returns the hostname of the url. example: https://www.youtube.com -> www.youtube.com
	 * @param url Url of address
	 * @returns Hostname of url or empty if url was empty
	 */
	static getHostname(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (!url.startsWith('http')) url = 'http://' + url;
		return new URL(url).hostname;
	}

	/**
	 * Returns the first subdomain of the url. example https://truvision.ontrac.io -> truvision
	 * @param url
	 * @returns First subdomain or an empty string
	 */
	static getFirstSubdomain(url: string): string {
		if (!url) return '';
		let hostname = this.getHostname(url);
		let hostnameSplit = hostname.split('.');
		if (hostnameSplit.length > 2) return hostnameSplit.splice(-3, 1)[0];
		return '';
	}

	/**
	 * Async sleep method for waiting for a timeout period
	 * @name sleep
	 * @param {number} ms - sleep time in milliseconds
	 * @returns {Promise}
	 * */
	static async sleep(ms: number) {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Takes an object and stringifies any nested objects
	 * @param data - Must be typeof object
	 * @returns An object whose children are either numbers, strings, booleans, no nested objects
	 */
	static convertDataForUrlParams(data: any): any {
		let convertedData: any = {};
		for (let i in data) {
			if (typeof data[i] === 'object') {
				convertedData[i] = JSON.stringify(data[i]);
			} else {
				convertedData[i] = data[i];
			}
		}
		return convertedData;
	}

	/**
	 * Returns a boolean to determine if the value is an array and that array contains data
	 * @param url
	 * @returns {boolean}
	 */
	static hasVideoExtension(url: string): boolean {
		return /.*\.(?:3g2|3gp|3gpp|aaf|asf|avchd|avi|drc|flv|m2v|m3u8|m4p|m4v|mkv|mng|mov|mp2|mp4|mpe|mpeg|mpg|mpv|mxf|nsv|ogg|ogv|qt|rm|rmvb|roq|svi|vob|webm|wmv|yuv)$/.test(
			url
		);
	}
}

/** Date related utilities */
export class DateUtils {
	/**
	 * Get number of days between a start and end date
	 * @param {Date | string} startDate
	 * @param {Date | string} endDate
	 * @returns {number} - Returns a number
	 */
	static daysBetweenStartAndEndDates(startDate: Date, endDate: Date): number {
		let differenceInTime = endDate.getTime() - startDate.getTime();
		return differenceInTime / (1000 * 3600 * 24);
	}

	/**
	 * Format a date for email templates
	 * @param {Date | string} date
	 * @returns {string} - Returns a string
	 */
	static formatDateForUser(date: string | Date) {
		if (date === 'N/A') return date;
		let newDate = new Date(`${date}`);
		return `${(newDate.getMonth() + 1).toString()}-${newDate.getDate()}-${newDate.getFullYear()}`;
	}

	/**
	 * Format a date for user readable format
	 * @param {Date | string} date
	 * @param {Intl.DateTimeFormatOptions} options - Defaults to numeric month, day, year
	 * @returns {string} - Returns a string
	 */
	static formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
		options ??= { year: 'numeric', day: 'numeric', month: 'numeric' };
		const dateFormater = new Intl.DateTimeFormat('en-US', options);
		const newDate = new Date(`${date}`);
		return dateFormater.format(newDate);
	}

	/**
	 * Returns a proper date string from database insertion using now's time stamp
	 * @name dbNow
	 * @returns {string} - Returns a string for datetime insertion into a database
	 */
	static dbNow(): string {
		return this.clientToServerDateTime(new Date());
	}
	/**
	 * Returns a proper Date string for a given hour offset
	 * @name hoursFromNow
	 * @param {number} hours - The number of hours you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static hoursFromNow(hours: number): string {
		let today = new Date();
		today.setTime(today.getTime() + hours * (1000 * 60 * 60));
		return this.clientToServerDateTime(today);
	}
	/**
	 * Returns a proper Date string for a given hour offset
	 * @name minutesFromNow
	 * @param {number} minutes - The number of minutes you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static minutesFromNow(minutes: number): string {
		let today = new Date();
		today.setTime(today.getTime() + minutes * (1000 * 60));
		return this.clientToServerDateTime(today);
	}
	/**
	 * Returns the number of days in the given month and year
	 * @param {number} month
	 * @param {number} year
	 * @returns {number} - Returns a number with the total days in the year/month
	 */
	static daysInMonth(month: number, year: number): number {
		return new Date(year, month, 0).getDate();
	}
	/**
	 * Pad a value with a leading zero
	 * @param {string} num
	 * @retuns {string} - Returns a zero padded number
	 */
	static padStart(num: string) {
		if (num.length >= 2) return num;
		return '0' + num.slice(-2);
	}
	/**
	 * Returns a date object with a new range of days
	 * @param {Date} date
	 * @param {number} days
	 * @returns {Date} - Returns a new date with days incremented
	 */
	static addDays(date: Date | string, days: number) {
		if (typeof date == 'string') date = new Date(date);
		date.setDate(date.getDate() + days);
		return date;
	}
	/**
	 * Get a range of dates inclusive between a start and end date
	 * @param {Date | string} startDate
	 * @param {Date | string} endDate
	 * @returns {string[]} - Returns a string array of inclusive dates
	 */
	static getDateRange(startDate: Date | string, endDate: Date | string): string[] {
		const dateArray: string[] = [];
		let currentDate = startDate;
		while (currentDate <= endDate) {
			const newDate = new Date(currentDate).toISOString().slice(0, 10);
			dateArray.push(`*${newDate}`);
			currentDate = DateUtils.addDays(currentDate, 1).toISOString().slice(0, 10);
		}
		return dateArray;
	}

	/**
	 * Display time of input date time
	 * @name displayTime
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayTime(date: Date | string) {
		if (typeof date === 'string') {
			let workingDate: Date | null = this.getDateFromString(date);
			if (workingDate == null) return date;
			date = workingDate;
		}
		let hours = date.getHours();
		let minutes: number | string = date.getMinutes();
		let ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // The hour '0' should be '12'
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${hours}:${minutes} ${ampm}`;
	}
	/**
	 * Display date of input date time as this: mm/dd/yyyy
	 * @name displayDate
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDate(date: Date | string): string {
		if (typeof date === 'string') {
			let workingDate: Date | null = this.getDateFromString(date);
			if (workingDate == null) return date;
			date = workingDate;
		}
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let year = date.getFullYear();

		return `${month}/${day}/${year}`;
	}

	/**
	 * Display day of the week of the input date
	 * @name displayDayOfWeek
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDayOfWeek(date: Date) {
		return days[date.getDay()];
	}

	/**
	 * Check if input date is the same week as current date
	 * @name isSameWeekAsCurrent
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isSameWeekAsCurrent(date: Date) {
		const current = new Date();
		if (current.getWeekOfMonth() !== date.getWeekOfMonth()) {
			return false;
		}
		if (current.getMonth() !== date.getMonth()) {
			return false;
		}
		if (current.getFullYear() !== date.getFullYear()) {
			return false;
		}
		return true;
	}

	/**
	 * Check if input date is the same day as current date
	 * @name isSameDayAsCurrent
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isSameDayAsCurrent(date: Date) {
		if (!date) {
			return false;
		}
		const current = new Date();
		if (current.getDate() !== date.getDate()) {
			return false;
		}
		if (current.getMonth() !== date.getMonth()) {
			return false;
		}
		if (current.getFullYear() !== date.getFullYear()) {
			return false;
		}
		return true;
	}

	/**
	 * Check if input date is yesterday
	 * @name isYesterday
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isYesterday(date: Date) {
		const currentDate = new Date();
		const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		const yesterdayMidnight = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() - 1
		);
		if (date.getTime() >= yesterdayMidnight.getTime() && date.getTime() <= todayMidnight.getTime()) {
			return true;
		}
		return false;
	}

	/**
	 * Convert client date time to server date time string
	 * @name clientToServerDateTime
	 * @param {Date} date
	 * @returns {string}
	 */
	static clientToServerDateTime(date: Date) {
		return date.toISOString().slice(0, 19).replace('T', ' ');
	}

	/**
	 * Convert client date to server date string
	 * @name clientToServerDate
	 * @param {Date} date
	 * @returns {string}
	 */
	static clientToServerDate(date: Date) {
		return date.toISOString().substring(0, 10);
	}

	/**
	 * Convert server date string to client date
	 * @name serverToClientDate
	 * @param {string} dateStr
	 * @returns {Date}
	 */
	static serverToClientDate(dateStr: string) {
		if (!dateStr) {
			return null;
		}
		return new Date(dateStr.replace(/T.*Z/g, '').replace(/-/g, '/'));
	}

	/**
	 * Convert server date time string to client date time
	 * @name serverToClientDateTime
	 * @param {string} dateStr
	 * @returns {Date}
	 */
	static serverToClientDateTime(dateStr: string) {
		if (!dateStr) {
			return dateStr;
		}
		var date = DateUtils.dateFromString(dateStr);
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	}

	/**
	 * Conver date string to date object
	 * @name dateFromString
	 * @param {string} dateStr
	 * @returns {Date}
	 */
	static dateFromString(dateStr: string) {
		dateStr = dateStr.replace('T', ' ').replace('Z', '');
		var a = dateStr.split(/[^0-9]/).map((s) => {
			return parseInt(s, 10);
		});
		return new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
	}

	/**
	 * Check if input date is a client date object
	 * @name isClientDate
	 * @param {any} date
	 * @returns {boolean}
	 */
	static isClientDate(date: any) {
		if (date && date.getTime && typeof date.getTime === 'function') {
			return true;
		} else {
			return false;
		}
	}

	private static getDateFromString(dateString: string): Date | null {
		try {
			return new Date(dateString);
		} catch {
			return null;
		}
	}
}
