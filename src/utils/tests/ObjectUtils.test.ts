import ObjectUtils from '../ObjectUtils';
import { describe, expect, it } from 'vitest';

describe('ObjectUtils', () => {
	describe('multiPropDedupe', () => {
		it('should dedupe an array of objects based on multiple properties', () => {
			expect(
				ObjectUtils.multiPropDedupe(
					[
						{ a: 1, b: 2 },
						{ a: 1, b: 2, c: 3 }
					],
					['a', 'b']
				)
			).toStrictEqual([{ a: 1, b: 2 }]);
			expect(
				ObjectUtils.multiPropDedupe(
					[{ a: 1, b: 2 }, { c: 3, d: 4 }, { a: 'a', b: 2, c: 3 }, { a: 1 }],
					['a', 'b', 'c']
				)
			).toStrictEqual([
				{ a: 1, b: 2 },
				{ c: 3, d: 4 },
				{ a: 'a', b: 2, c: 3 }
			]);
		});
	});

	describe('paginateArray', () => {
		it('should paginate an array', () => {
			expect(ObjectUtils.paginateArray([1, 2, 3, 4, 5], 1, 2)).toStrictEqual([1, 2]);
			expect(ObjectUtils.paginateArray([1, 2, 3, 4, 5], 2, 2)).toStrictEqual([3, 4]);
			expect(ObjectUtils.paginateArray([1, 2, 3, 4, 5], 3, 2)).toStrictEqual([5]);
		});
	});

	describe('filterInPlace', () => {
		it('should filter an array in place', () => {
			const arr = [1, 2, 3, 4, 5];
			ObjectUtils.filterInPlace(arr, (val) => val % 2 === 0);
			expect(arr).toStrictEqual([2, 4]);
		});
	});

	describe('forceCast', () => {
		it('should force cast a value', () => {
			expect(ObjectUtils.forceCast<string>(1)).toBe(1);
			expect(ObjectUtils.forceCast<number>('1')).toBe('1');
			expect(ObjectUtils.forceCast<object>(true)).toBe(true);
			expect(ObjectUtils.forceCast<unknown>(false)).toBe(false);
			expect(ObjectUtils.forceCast<JSON>({})).toStrictEqual({});
			expect(ObjectUtils.forceCast<number>([])).toStrictEqual([]);
		});
	});

	describe('safeParse', () => {
		it('should parse a value', () => {
			expect(ObjectUtils.safeParse('')).toStrictEqual({});
			expect(ObjectUtils.safeParse(null)).toStrictEqual({});
			expect(ObjectUtils.safeParse({ a: 1 })).toStrictEqual({ a: 1 });
			expect(ObjectUtils.safeParse('{"a":1}')).toStrictEqual({ a: 1 });
			expect(ObjectUtils.safeParse('{ a: 1 }')).toStrictEqual('{ a: 1 }');
		});
	});

	describe('doesObjectHaveProperty', () => {
		it('should check if an object has a key', () => {
			expect(ObjectUtils.doesObjectHaveProperty({}, 'a')).toBe(false);
			expect(ObjectUtils.doesObjectHaveProperty({ a: 1 }, 'a')).toBe(true);
			expect(ObjectUtils.doesObjectHaveProperty({ a: 1 }, 'b')).toBe(false);
		});
	});

	describe('deepMerge', () => {
		it('should merge two objects', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 2, c: 3 };
			expect(ObjectUtils.deepMerge(obj1, obj2)).toStrictEqual({ a: 2, b: 2, c: 3 });
			expect(ObjectUtils.deepMerge(obj2, obj1)).toStrictEqual({ a: 1, b: 2, c: 3 });
		});
	});

	describe('deepValueReplace', () => {
		it('should replace a value', () => {
			const obj = { a: { b: { c: { d: '1' }, c2: 'd1' } } };
			expect(ObjectUtils.deepValueReplace(obj, /1/g, '2')).toStrictEqual({
				a: { b: { c: { d: '2' }, c2: 'd2' } }
			});
			expect(ObjectUtils.deepValueReplace(obj, /d/g, 'a')).toStrictEqual({
				a: { b: { c: { d: '1' }, c2: 'a1' } }
			});
		});
	});

	describe('isEmptyObject', () => {
		it('should check if an object is empty', () => {
			expect(ObjectUtils.isEmptyObject({})).toBe(true);
			expect(ObjectUtils.isEmptyObject({ a: 1 })).toBe(false);
		});
	});

	describe('isObject', () => {
		it('should check if a value is an object', () => {
			expect(ObjectUtils.isObject({})).toBe(true);
			expect(ObjectUtils.isObject([])).toBe(true);
			expect(ObjectUtils.isObject('')).toBe(false);
			expect(ObjectUtils.isObject(1)).toBe(false);
			expect(ObjectUtils.isObject(true)).toBe(false);
			expect(ObjectUtils.isObject(null)).toBe(false);
			expect(ObjectUtils.isObject(undefined)).toBe(false);
		});
	});

	describe('mapObject', () => {
		it('should map an object', () => {
			const testObject = { a: 1, b: 2, c: 3 };
			expect(ObjectUtils.mapObject(testObject, (val) => val + 1)).toStrictEqual({ a: 2, b: 3, c: 4 });
			expect(ObjectUtils.mapObject(testObject, (val) => val + 1, ['a', 'c'])).toStrictEqual({ a: 2, c: 4 });
			expect(ObjectUtils.mapObject(testObject, (val, key) => `${key}${val}`)).toStrictEqual({
				a: 'a1',
				b: 'b2',
				c: 'c3'
			});
		});
	});

	describe('map', () => {
		it('should map an object', () => {
			expect(ObjectUtils.map({ a: 1, b: 2 }, (val) => val + 1)).toStrictEqual([2, 3]);
			expect(ObjectUtils.map({ a: 1, b: 2 }, (val, key) => `${key}${val}`)).toStrictEqual(['a1', 'b2']);
			expect(ObjectUtils.map({ a: 1, b: 2 }, (val, key) => `${key}${val}`, ['a'])).toStrictEqual(['a1']);
		});
	});

	describe('omit', () => {
		it('should omit properties from an object', () => {
			expect(ObjectUtils.omit({ a: 1, b: 2, c: 3 }, ['d'])).toStrictEqual({ a: 1, b: 2, c: 3 });
			expect(ObjectUtils.omit({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toStrictEqual({ c: 3 });
			expect(ObjectUtils.omit({ a: 1, b: 2, c: 3 }, ['a', 'b', 'c'])).toStrictEqual({});
			expect(ObjectUtils.omit([1, 2, 3], [1])).toStrictEqual({ 0: 1, 2: 3 });
		});
	});

	describe('pick', () => {
		it('should pick properties from an object', () => {
			expect(ObjectUtils.pick({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toStrictEqual({ a: 1, b: 2 });
			expect(ObjectUtils.pick({ a: 1, b: 2, c: 3 }, ['a', 'b', 'c'])).toStrictEqual({ a: 1, b: 2, c: 3 });
			expect(ObjectUtils.pick({ a: 1, b: 2, c: 3 }, [])).toStrictEqual({});
		});
	});

	describe('serialize', () => {
		it('should serialize an object for url params', () => {
			expect(ObjectUtils.serialize({})).toBe('');
			expect(ObjectUtils.serialize({ a: 1 })).toBe('a=1');
			expect(ObjectUtils.serialize({ a: 1, b: 2 })).toBe('a=1&b=2');
			expect(ObjectUtils.serialize({ a: [1, 2, '3'] })).toBe('a[]=1&a[]=2&a[]=3');
			expect(
				ObjectUtils.serialize({
					a: 1.21,
					b: [],
					c: undefined,
					d: 'HelloWord',
					e: 0
				})
			).toBe('a=1.21&d=HelloWord&e=0');
		});
	});

	describe('serverToClientObj', () => {
		it('should convert an object from server to client', () => {
			expect(ObjectUtils.serverToClientObj({})).toStrictEqual({});
			expect(ObjectUtils.serverToClientObj({ a: 1 })).toStrictEqual({ a: 1 });
			expect(ObjectUtils.serverToClientObj({ a: 1, b: 2 })).toStrictEqual({ a: 1, b: 2 });
			expect(ObjectUtils.serverToClientObj({ a: 1, b: 2, c: 3 })).toStrictEqual({ a: 1, b: 2, c: 3 });
		});
	});

	describe('toArray', () => {
		it('should convert an object to an array', () => {
			expect(ObjectUtils.toArray({})).toStrictEqual([]);
			expect(ObjectUtils.toArray({ a: 1 })).toStrictEqual([1]);
			expect(ObjectUtils.toArray({ a: 1, b: 2 })).toStrictEqual([1, 2]);
			expect(ObjectUtils.toArray({ a: 1, b: 2, c: 3 })).toStrictEqual([1, 2, 3]);
		});
	});

	describe('toObject', () => {
		it('should convert an array to an object', () => {
			expect(ObjectUtils.toObject([1])).toStrictEqual({ 0: 1 });
			expect(ObjectUtils.toObject([1, 2])).toStrictEqual({ 0: 1, 1: 2 });
			expect(ObjectUtils.toObject([1, 2, 3])).toStrictEqual({ 0: 1, 1: 2, 2: 3 });
		});
	});

	describe('update', () => {
		it('should update an object', () => {
			const testObject = { a: 1, b: 2, c: { d: 3 } };
			expect(ObjectUtils.update(testObject, { a: 2 })).toStrictEqual({ a: 2, b: 2, c: { d: 3 } });
			expect(ObjectUtils.update(testObject, { a: 2, c: { d: 4 } })).toStrictEqual({ a: 2, b: 2, c: { d: 4 } });
			expect(ObjectUtils.update(testObject, { c: { d: 20 }, a: 2 })).toStrictEqual({ a: 2, b: 2, c: { d: 20 } });
		});
	});

	describe('sort', () => {
		it('should sort an array of objects', () => {
			const testObject = [
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 2, c: 1 },
				{ a: 1, b: 2, c: 2 }
			];
			expect(ObjectUtils.sort(testObject, 'c')).toStrictEqual([
				{ a: 1, b: 2, c: 1 },
				{ a: 1, b: 2, c: 2 },
				{ a: 1, b: 2, c: 3 }
			]);
			expect(ObjectUtils.sort(testObject, 'c', true)).toStrictEqual([
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 2, c: 2 },
				{ a: 1, b: 2, c: 1 }
			]);
		});
	});

	describe('isEmpty', () => {
		it('should check if a value is empty', () => {
			expect(ObjectUtils.isEmpty({})).toBe(true);
			expect(ObjectUtils.isEmpty([])).toBe(true);
			expect(ObjectUtils.isEmpty('')).toBe(true);
			expect(ObjectUtils.isEmpty(1)).toBe(false);
			expect(ObjectUtils.isEmpty(true)).toBe(false);
			expect(ObjectUtils.isEmpty(null)).toBe(true);
			expect(ObjectUtils.isEmpty(undefined)).toBe(true);
		});
	});

	describe('getObjectLength', () => {
		it('should get the length of an object', () => {
			expect(ObjectUtils.getObjectLength([])).toBe(0);
			expect(ObjectUtils.getObjectLength({})).toBe(0);
			expect(ObjectUtils.getObjectLength('')).toBe(-1);
			expect(ObjectUtils.getObjectLength(1)).toBe(-1);
			expect(ObjectUtils.getObjectLength(true)).toBe(-1);
			expect(ObjectUtils.getObjectLength({ a: 1 })).toBe(1);
			expect(ObjectUtils.getObjectLength([1, 2, 3])).toBe(3);
			expect(ObjectUtils.getObjectLength({ a: 1, b: 2 })).toBe(2);
			expect(ObjectUtils.getObjectLength({ a: 1, b: 2, c: 3 })).toBe(3);
		});
	});

	describe('getData', () => {
		it('should get data from an object', () => {
			expect(ObjectUtils.getData({ data: { a: 1 } })).toStrictEqual({ a: 1 });
			expect(ObjectUtils.getData({ data: false })).toBe(false);
			expect(ObjectUtils.getData({ data: 1 })).toBe(1);
		});
	});

	describe('smartParse', () => {
		it('should parse json', () => {
			expect(ObjectUtils.smartParse('test')).toBe('test');
			expect(ObjectUtils.smartParse('')).toStrictEqual({});
			expect(ObjectUtils.smartParse('{ a: 1 }')).toBe('{ a: 1 }');
			expect(ObjectUtils.smartParse('{"a":1}')).toStrictEqual({ a: 1 });
		});
	});

	describe('isArrayWithData', () => {
		it('should check if an array has data', () => {
			expect(ObjectUtils.isArrayWithData([])).toBe(false);
			expect(ObjectUtils.isArrayWithData([1])).toBe(true);
			expect(ObjectUtils.isArrayWithData([1, 2])).toBe(true);
		});
	});

	describe('group', () => {
		it('should group an array of objects', () => {
			const testObject = [
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 3, c: 1 },
				{ a: 1, b: 2, c: 2 }
			];
			expect(ObjectUtils.group(testObject, 'c')).toStrictEqual({
				1: [{ a: 1, b: 3, c: 1 }],
				2: [{ a: 1, b: 2, c: 2 }],
				3: [{ a: 1, b: 2, c: 3 }]
			});
			expect(ObjectUtils.group(testObject, 'b')).toStrictEqual({
				2: [
					{ a: 1, b: 2, c: 3 },
					{ a: 1, b: 2, c: 2 }
				],
				3: [{ a: 1, b: 3, c: 1 }]
			});
			expect(ObjectUtils.group(testObject, 'a')).toStrictEqual({
				1: [
					{ a: 1, b: 2, c: 3 },
					{ a: 1, b: 3, c: 1 },
					{ a: 1, b: 2, c: 2 }
				]
			});
		});
	});

	describe('filterObject', () => {
		it('should filter an object', () => {
			const testObject = { a: 1, b: 2, c: 3 };
			expect(ObjectUtils.filterObject(testObject, (val) => val % 2 === 0)).toStrictEqual({ b: 2 });
			expect(ObjectUtils.filterObject(testObject, (val) => val % 2 === 1)).toStrictEqual({ a: 1, c: 3 });
		});
	});

	describe('cloneDeep', () => {
		it('should clone object', () => {
			const obj = { a: 1, b: 2 };
			const clone = ObjectUtils.cloneDeep(obj);
			expect(clone).toEqual(obj);
			expect(clone).not.toBe(obj);
			const obj2 = { a: 1, b: { c: 2 } };
			const clone2 = ObjectUtils.cloneDeep(obj2);
			expect(clone2).toEqual(obj2);
			expect(clone2).not.toBe(obj2);
			expect(clone2.b).toEqual(obj2.b);
			expect(clone2.b).not.toBe(obj2.b);
		});
	});

	describe('toBoolean', () => {
		it('should convert a value to a boolean', () => {
			expect(ObjectUtils.toBoolean('true')).toBe(true);
			expect(ObjectUtils.toBoolean('false')).toBe(false);
			expect(ObjectUtils.toBoolean('')).toBe(false);
			expect(ObjectUtils.toBoolean('test')).toBe(true);
			expect(ObjectUtils.toBoolean(1)).toBe(true);
			expect(ObjectUtils.toBoolean(0)).toBe(false);
			expect(ObjectUtils.toBoolean(2)).toBe(true);
			expect(ObjectUtils.toBoolean({})).toBe(true);
			expect(ObjectUtils.toBoolean([])).toBe(true);
			expect(ObjectUtils.toBoolean(null)).toBe(false);
			expect(ObjectUtils.toBoolean(undefined)).toBe(false);
		});
	});

	describe('removeEmptyProperties', () => {
		it('should remove empty properties from an object', () => {
			const obj = { a: 1, b: 2, c: undefined, d: null, e: '', f: 'test' };
			expect(ObjectUtils.removeEmptyProperties(obj)).toStrictEqual({ a: 1, b: 2, f: 'test' });
		});
	});

	describe('removeEmptyPropertiesDeep', () => {
		it('should remove empty properties from an object', () => {
			const obj = {
				a: 1,
				b: 2,
				c: undefined,
				d: null,
				e: '',
				f: 'test',
				g: { h: 1, i: undefined, j: null, k: '' }
			};
			expect(ObjectUtils.removeEmptyPropertiesDeep(obj)).toStrictEqual({ a: 1, b: 2, f: 'test', g: { h: 1 } });
		});
	});

	describe('removeDuplicates', () => {
		it('should remove duplicates from an array of objects', () => {
			const arr = [
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 2, c: 4 },
				{ a: 1, b: 2, c: 4 },
				{ a: 1, b: 2, c: 5 },
				{ a: 1, b: 2, c: 5 }
			];
			expect(ObjectUtils.removeDuplicates(arr)).toStrictEqual([
				{ a: 1, b: 2, c: 3 },
				{ a: 1, b: 2, c: 4 },
				{ a: 1, b: 2, c: 5 }
			]);
			expect(ObjectUtils.removeDuplicates(arr, ['a'])).toStrictEqual([{ a: 1, b: 2, c: 3 }]);
			expect(ObjectUtils.removeDuplicates(arr, ['a', 'b'])).toStrictEqual([{ a: 1, b: 2, c: 3 }]);
		});
	});

	describe('isEqual', () => {
		it('should check if two objects are equal', () => {
			const obj1 = { a: 1, b: 2, c: 3 };
			const obj2 = { a: 1, b: 2, c: 3 };
			const obj3 = { a: 1, b: 2, c: 4 };
			expect(ObjectUtils.isEqual(obj1, obj1)).toBe(true);
			expect(ObjectUtils.isEqual(obj1, obj2)).toBe(true);
			expect(ObjectUtils.isEqual(obj1, obj3)).toBe(false);
		});
	});

	describe('sortAttributes', () => {
		it('should sort an object by its attributes', () => {
			const obj = { b: 2, a: 1, c: 3 };
			expect(ObjectUtils.sortAttributes(obj)).toStrictEqual({ a: 1, b: 2, c: 3 });
			expect(ObjectUtils.sortAttributes(obj, true)).toStrictEqual({ c: 3, b: 2, a: 1 });
		});
	});
});
