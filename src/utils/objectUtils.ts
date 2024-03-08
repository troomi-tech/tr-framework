import { cloneDeep } from 'lodash';
import DateUtils from './DateUtils';
import StringUtils from './StringUtils';
import { TypingUtils } from './TypingUtils';
import { isObject } from 'lodash';

export interface RsResponseData<T> {
	data: T;
}

/** Object related utilities */
export default class ObjectUtils {
	/**
	 * Dedupe an array of tables with a compound key
	 * @param {any[]} dataset - an array of tables
	 * @param {...string[]} properties - property string you wish to dedupe on
	 * @returns {any[]} - Deduped version of the original dataset
	 */
	static multiPropDedupe<T extends object>(dataset: T[], properties: (keyof T)[]): T[] {
		if (properties.length === 0) return dataset;
		const values: T[] = [];
		for (let data of dataset) {
			if (
				values.some(function (obj: any) {
					for (let prop of properties) {
						if (!ObjectUtils.hasProperty(data, prop)) continue;
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
	 * Takes an array of objects and returns a new array of objects with the specified properties
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
	 * Based on the answer here {@link https://stackoverflow.com/a/57685728}
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
	 * @param {any} obj The object to force cast
	 * @returns {T} Returns the object as the type you want
	 */
	static forceCast<T>(obj: any): T {
		return obj as unknown as T;
	}

	/**
	 * Returns a base object either through JSON.parse or a clone of the original object
	 * @param {any} json A stringified object
	 * @returns {object} Returns a json object of the stringified object
	 */
	static safeParse(json: any): object | any {
		if (!json) return {};
		try {
			return JSON.parse(json);
		} catch (e) {
			return ObjectUtils.cloneDeep(json);
		}
	}

	/**
	 * Syntatic sugar or `Object.prototype.hasOwnProperty.call(obj, key)`
	 * @param {object} obj the object to test
	 * @param {PropertyKey} key the property to test
	 * @returns {boolean}
	 */
	static doesObjectHaveProperty<T extends object, U extends PropertyKey>(
		obj: T,
		key: U
	): obj is T & Record<U, unknown> {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}

	/**
	 * Alias for {@link ObjectUtils.doesObjectHaveProperty}
	 * @param {object} obj the object to check
	 * @param {PropertyKey} key the property to check
	 * @returns {boolean}
	 */
	static hasOwnProperty<T extends object, U extends PropertyKey>(obj: T, key: U): obj is T & Record<U, unknown> {
		return ObjectUtils.doesObjectHaveProperty(obj, key);
	}

	/**
	 * Deep merge two objects, the second object will overwrite the first
	 * @param {object} oldObject The base object to merge into
	 * @param {object} newObject The object to merge into the base object
	 * @returns {object} a new object with the merged values
	 * @example
	 * deepMerge(
	 * 	{a:"red",b: {b1:"blue",b2:"red"},c:{c1:{c11:"red"}}},
	 * 	{a:"yellow",b: {b1:"yellow"},c:{c1:{c11:"yellow"}}}
	 * ) === {a:"yellow",b: {b1:"yellow",b2:"red"},c:{c1:{c11:"yellow"}}}
	 */
	static deepMerge<T extends object>(
		oldObject: TypingUtils.DeepPartial<T> | T,
		newObject: TypingUtils.DeepPartial<T> | T
	): T {
		if (!oldObject || !newObject || typeof oldObject !== 'object' || typeof newObject !== 'object')
			throw new Error('Both arguments must be objects');

		const mergedObject = { ...oldObject } as T;
		let key: keyof T & keyof TypingUtils.DeepPartial<T> & PropertyKey;
		for (key in newObject) {
			if (!ObjectUtils.doesObjectHaveProperty(newObject, key)) continue;
			if (isObject(newObject) && isObject(oldObject) && key in oldObject && isObject(newObject[key]))
				Object.assign(mergedObject, {
					[key]: ObjectUtils.deepMerge(oldObject[key] as object, newObject[key] as object)
				});
			else Object.assign(mergedObject, { [key]: newObject[key] });
		}

		return mergedObject;
	}

	/**
	 * Deep value replace for object
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
	static deepValueReplace(entity: any, search: string | RegExp, replacement: string): object {
		let newEntity: typeof entity = {},
			regExp = new RegExp(search, 'g');
		for (let property in entity) {
			if (!Object.prototype.hasOwnProperty.call(entity, property)) continue;

			let value = entity[property],
				newProperty = property;
			if (typeof value === 'object') value = ObjectUtils.deepValueReplace(value, search, replacement);
			else if (typeof value === 'string') value = value.replace(regExp, replacement);

			newEntity[newProperty] = value;
		}

		return newEntity;
	}

	/**
	 * Check if it is an empty object
	 * @param {object} obj
	 * @returns {boolean}
	 */
	static isEmptyObject<T extends object>(obj: T): boolean {
		for (let key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
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
	 * Tests if the an object has a property
	 * @param obj the object to test
	 * @param key the property to test
	 * @returns {boolean}
	 */
	static hasProperty<T extends object, U extends PropertyKey>(obj: T, key: U): obj is T & Record<U, unknown> {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}

	/**
	 * Takes an object and runs through a function for each key/value pair.
	 * @param {object} obj the object to map
	 * @param {function} fn the function to map the object with
	 * @param {string[]} keys the keys to map over. Defaults to all keys
	 * @returns {object} an object with the same keys but the values are the result of the function
	 */
	static mapObject<T extends object, U>(
		obj: T,
		fn: (value: T[keyof T], key: keyof T, object: T) => U,
		keys: (keyof T)[] = Object.keys(obj) as (keyof T)[]
	): { [key in keyof T]: U } {
		const res: any = {};
		// for (let key in obj) res[key] = fn(obj[key as keyof T], key as keyof T, obj);
		for (let key of keys) res[key] = fn(obj[key as keyof T], key as keyof T, obj);

		return res;
	}

	/**
	 * Takes an object and runs through a function for each key/value pair
	 * @param {object} obj the object to map
	 * @param {function} fn the function to map the object with
	 * @param {string[]} keys the keys to map over. Defaults to all keys
	 * @returns {object} the mapped object
	 */
	static map<T extends object, U>(
		obj: T,
		fn: (value: T[keyof T], key: keyof T, object: T) => U,
		keys: (keyof T)[] = Object.keys(obj) as (keyof T)[]
	): U[] {
		return keys.map((key) => fn(obj[key as keyof T], key as keyof T, obj));
	}

	/**
	 * Returns the object with a list of fields removed, of a type without those fields
	 * @param {T} obj an object or array of tables to sanitize
	 * @param {U[]} remove an array of property names or indices to remove
	 * @returns {Omit<T, U>} the sanitized object or array
	 */
	static omit<T, U extends string | number | symbol>(obj: T, remove: U[]): Omit<T, U> {
		const result: any = { ...obj };
		for (let key of remove) delete result[key];
		return result;
	}

	/**
	 * Returns a new object with only the fields you wish to return
	 * @param {T} obj - A given object you wish to return a new object from
	 * @param {U[]} fields - An array of columns(keys) wished to return from object
	 * @returns {Pick<T, U>} - Returns a new object with only the fields you wish to return
	 * */
	static pick<T extends object, U extends keyof T>(obj: T, fields: U[]): Pick<T, U> {
		const result: T = { ...obj };
		const stringFields = fields.map(String);
		for (let i in result) {
			if (stringFields.includes(i)) continue;
			delete result[i];
		}
		return result;
	}

	/**
	 * Serialize an object to query string
	 * @param {any} obj
	 * @returns {string}
	 */
	static serialize(obj: any): string {
		const str = [];
		for (let p in obj)
			if (Object.prototype.hasOwnProperty.call(obj, p)) {
				if (obj[p] === undefined || obj[p] === null) continue;
				if (obj[p] instanceof Array) {
					let concatArray: any = [];
					for (let i = 0; i < obj[p].length; i++) {
						concatArray.push(encodeURIComponent(p) + '[]=' + encodeURIComponent(obj[p][i]));
					}
					if (concatArray.length < 1) continue;
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
	 * @param {any} object
	 * @param {any} metadata
	 * @returns {any}
	 */
	static serverToClientObj(object: any, metadata: any = null): any {
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

	/**
	 * Convert server property to client property
	 * @param {unknown} property property to convert
	 * @param {object} metadata metadata of the property
	 * @returns {any} property
	 */
	static serverToClientProperty(property: unknown, metadata: object): any {
		if ('type' in metadata && metadata.type === 'date') property = DateUtils.serverToClientDate(String(property));
		else if ('type' in metadata && metadata.type === 'datetime')
			property = DateUtils.serverToClientDateTime(String(property));

		return property;
	}

	/**
	 * Convert client object to server object
	 * @param {any} obj
	 * @param {any} metadata
	 * @returns {any}
	 */
	static clientToServerObj(obj: any, metadata: any): any {
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
			for (let j in object) {
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
		if (metadata.type === 'date') return DateUtils.clientToServerDate(property);
		else if (metadata.type === 'datetime') return DateUtils.clientToServerDateTime(property);
		else if (metadata.type === 'related' && property === '') return null;
		else if (metadata.type === 'boolean') return property ? 1 : 0;
		return property;
	}

	/**
	 * Converts an object to an array
	 * @param {T} obj The object to convert
	 * @returns {T[keyof T][]}
	 */
	static toArray<T extends object>(obj: T): T[keyof T][] {
		return Object.keys(obj).map((key) => obj[key as keyof T]);
	}

	/**
	 * Converts an array to an object by using the array index as the key
	 * @param {T[]} arr The array to convert
	 * @returns {object}
	 */
	static toObject<T extends any[]>(arr: T): { [key in keyof T]: T[key] } {
		return arr.reduce((acc, curr, i) => {
			acc[i] = curr;
			return acc;
		}, {});
	}

	/**
	 * Updates an the properties of an object based on a new objects properties and values
	 * @param {T} obj The object to update
	 * @param {Partial<T>} newObj The new object to use as the updates
	 * @returns {T}
	 */
	static update<T extends object>(obj: T, newObj: Partial<T>): T {
		return Object.assign(obj, newObj);
	}

	/**
	 * Sorts an object or array based on a property and direction
	 * @param dataset - The dataset to sort
	 * @param property - The property to sort by
	 * @param reverse - Sort in reverse direction (default: false)
	 */
	static sort<T>(dataset: T[], property: keyof T, reverse: boolean = false) {
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
	 * @param {unknown} obj The dataset to check
	 * @returns {boolean} whether the object has any keys or not
	 */
	static isEmpty(obj: unknown): boolean {
		if (!obj) return true;
		if (typeof obj !== 'object') return false;
		return Object.keys(obj).length === 0;
	}

	/**
	 * Get the length of an object by counting its keys.
	 * If the object is an array, return the length of the array.
	 * If the object is not an object or is null, return -1
	 * @param {unknown} obj the object to get the length of
	 * @returns {number} the length of the object
	 */
	static getObjectLength(obj: unknown): number {
		if (typeof obj !== 'object' || !obj) return -1;
		if (Array.isArray(obj)) return obj.length;
		return Object.keys(obj).length;
	}

	/**
	 * Returns the stripped off data object from a standard database response
	 * @param {object} - A standard RsResponseData from the database layer
	 * @returns {object} - Returns the base object nested within the RsResponseData
	 */
	static getData<T>(obj: RsResponseData<T>): T | RsResponseData<T> {
		if (!!obj && (obj.data || (typeof obj.data === 'boolean' && obj.data === false))) {
			return obj.data;
		}
		return obj;
	}

	/**
	 * Returns a base object either through JSON.parse or on failure the original item is returned
	 * @param json
	 * @returns {object} - Returns a json object of the stringified object
	 */
	static smartParse<T>(json: T): object | T {
		if (!json) return {};
		try {
			return JSON.parse(json as any);
		} catch (e) {
			return json;
		}
	}

	/**
	 * Returns a boolean to determine if the value is an array and that array contains data
	 * @param {unknown} possibleArray - Any value that you want to evaluate if it is an array and contains data
	 * @returns {boolean} - Returns a boolean value
	 * */
	static isArrayWithData(possibleArray: unknown): possibleArray is unknown[] {
		return !!(possibleArray && Array.isArray(possibleArray) && possibleArray.length > 0);
	}

	/**
	 * Groups a dataset by a property.
	 * @param {T} dataset - The dataset to group
	 * @param {keyof T} property - The property to group by
	 * @returns {object} - Returns an object with the grouped data
	 */
	static group<T extends object>(dataset: T[], property: keyof T): Record<string, T[]> {
		const res: any = {};
		for (let i in dataset) {
			if (dataset[i] === null) continue;
			if (!res[dataset[i][property]]) res[dataset[i][property]] = [];
			res[dataset[i][property]].push(dataset[i]);
		}
		return res;
	}

	/**
	 * Filters an object based on a filter function
	 * @param {T} obj - A given object you wish to filter
	 * @param {(value: T[keyof T], key: keyof T) => boolean} filter - A filter function that returns a boolean
	 * @returns {T} - Returns a new object with only the fields you wish to return
	 */
	static filterObject<T extends object>(obj: T, filter: (value: T[keyof T], key: keyof T) => boolean): T {
		const res: any = {};
		for (let key in obj) if (filter(obj[key as keyof T], key as keyof T)) res[key] = obj[key as keyof T];
		return res;
	}

	/**
	 * Performs a deep clone of an object
	 * @param {T} obj - Any object you wish to have a deep copy of
	 * @returns {T}
	 * */
	static cloneDeep<T>(obj: T): T {
		return cloneDeep(obj);
	}

	/**
	 * Cast a value to a boolean value
	 * @param {unknown} data - Any value that you want to actually evaluate to a boolean value
	 * @return {boolean}
	 */
	static toBoolean(data: unknown): boolean {
		return !!!(data === 'false' || !data);
	}

	/**
	 * Removes empty properties from an object
	 * @param {T} obj - Any object you wish to remove empty properties from
	 * @returns {T}
	 */
	static removeEmptyProperties<T extends object>(obj: T): T {
		for (let key in obj) if (ObjectUtils.isEmpty(obj[key as keyof T])) delete obj[key as keyof T];
		return obj;
	}

	/**
	 * Removes empty properties from an object recursively
	 * @param {T} obj - Any object you wish to remove empty properties from
	 * @returns {T}
	 */
	static removeEmptyPropertiesDeep<T extends object>(obj: T): T {
		let key: keyof T;
		for (key in obj) {
			const value = obj[key];
			if (ObjectUtils.isEmpty(obj[key])) delete obj[key];
			else if (!!value && typeof value === 'object') ObjectUtils.removeEmptyPropertiesDeep(value);
		}
		return obj;
	}

	/**
	 * Removes duplicate objects from an array of objects.
	 * Objects are compared by {@link ObjectUtils.isEqual}
	 * @param {T[]} obj - An array of objects you wish to remove duplicates from
	 * @param {keyof T[]} keys - An array of keys to compare the objects by
	 * @returns {T[]}
	 */
	static removeDuplicates<T extends object>(obj: T[], keys: (keyof T)[] = Object.keys(obj[0]) as (keyof T)[]): T[] {
		return obj.filter(
			(value, index, array) =>
				array.findIndex((t) =>
					ObjectUtils.isEqual(ObjectUtils.pick(value, keys), ObjectUtils.pick(t, keys))
				) === index
		);
	}

	/**
	 * Checks if two objects are equal. Does not check for circular references.
	 * Compares values by stringifying them and comparing the strings
	 * @param {T} obj1 - Any object you wish to compare
	 * @param {T} obj2 - Any object you wish to compare
	 * @returns {boolean} whether the objects are equal or not
	 */
	static isEqual<T>(obj1: T, obj2: T): boolean {
		return JSON.stringify(obj1) === JSON.stringify(obj2);
	}

	/**
	 * Sort the attributes of an object to return ASC
	 * @param {T} dataset - any singular object
	 * @returns {T} - Returns the given object with values sorted ASC order
	 */
	static sortAttributes<T extends object>(dataset: T, reverse: boolean = false): T {
		const sortedKeys = Object.keys(dataset).sort();
		if (reverse) sortedKeys.reverse();
		return sortedKeys.reduce<T>(
			(accumulator, key) => ({
				...accumulator,
				[key]: dataset[key as keyof T]
			}),
			{} as T
		);
	}
}
