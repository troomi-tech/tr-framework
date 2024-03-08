import FunctionUtils from '../FunctionUtils';
import { describe, expect, it, vitest } from 'vitest';

describe('FunctionUtils', () => {
	describe('getFunctionName', () => {
		it('should return the name of the function', () => {
			expect(FunctionUtils.getFunctionName(() => {})).toBe('');
			expect(FunctionUtils.getFunctionName(function () {}, 'test')).toBe('test');
			expect(FunctionUtils.getFunctionName(function testFunction() {})).toBe('testFunction');
			expect(FunctionUtils.getFunctionName('function testFunction() {}')).toBe('testFunction');
			expect(FunctionUtils.getFunctionName('function () {}')).toBe('');
			const testFunc = () => {};
			expect(FunctionUtils.getFunctionName(testFunc)).toBe('testFunc');
		});
	});
	describe('getFunctionParams', () => {
		it('should return the parameters of the function', () => {
			expect(FunctionUtils.getFunctionParams(() => {})).toEqual([]);
			expect(FunctionUtils.getFunctionParams(function () {})).toEqual([]);
			expect(FunctionUtils.getFunctionParams((...args: any[]) => args)).toEqual(['args']);
			expect(FunctionUtils.getFunctionParams('function () {}')).toEqual([]);
			expect(FunctionUtils.getFunctionParams('function (a, b, c) {}')).toEqual(['a', 'b', 'c']);
			expect(FunctionUtils.getFunctionParams('function (a=12, b="hello", ...c) {}')).toEqual(['a', 'b', 'c']);
			const testFunc = (a: boolean, b: object, c: number[]) => a && b && c;
			expect(FunctionUtils.getFunctionParams(testFunc)).toEqual(['a', 'b', 'c']);
			expect(FunctionUtils.getFunctionParams((a: number = 12, b: any, c: any) => a && b && c)).toEqual([
				'a',
				'b',
				'c'
			]);
		});
	});
	describe('wrapFunction', () => {
		it('should wrap a function with another function', () => {
			const wrapper =
				(originalFn: (...args: any[]) => any) =>
				(...args: any[]) => {
					args[0] = 5;
					return originalFn(...args);
				};
			const originalFn = (a: number) => a;
			const wrappedFn = FunctionUtils.wrapFunction(wrapper, originalFn);
			expect(wrappedFn(1)).toBe(5);
		});
	});
	describe('sleep', () => {
		it('should sleep for the specified amount of time', async () => {
			const startTime = Date.now();
			await FunctionUtils.sleep(20);
			const endTime = Date.now();
			expect(endTime - startTime).toBeGreaterThanOrEqual(20);
		});
	});
	describe('retry', () => {
		it('should retry a function until it succeeds or the number of retries is reached', async () => {
			const func1 = vitest.fn(() => Promise.resolve('test'));
			const result = await FunctionUtils.retry(func1, 3, 20, 1);
			expect(result).toBe('test');
			expect(func1).toHaveBeenCalledTimes(1);
			const func2 = vitest.fn(() => Promise.reject('test'));
			await FunctionUtils.retry(func2, 1, 20, 1).catch(() => expect(func2).toHaveBeenCalledTimes(1));
			const func3 = vitest.fn(() => Promise.reject('test'));
			const startTime = Date.now();
			await FunctionUtils.retry(func3, 3, 20, 2).catch((e) => {
				const endTime = Date.now();
				expect(endTime - startTime).toBeGreaterThanOrEqual(60);
				expect(func3).toHaveBeenCalledTimes(3);
				expect(e).toBe('test');
			});
		});
	});
});
