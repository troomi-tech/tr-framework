import NumberUtils from '../numberUtils';
import { describe, expect, it } from 'vitest';

describe('NumberUtils', () => {
	describe('dollarsToCents', () => {
		it('should convert dollars to cents', () => {
			expect(NumberUtils.dollarsToCents(0)).toBe(0);
			expect(NumberUtils.dollarsToCents(1)).toBe(100);
			expect(NumberUtils.dollarsToCents(0.01)).toBe(1);
			expect(NumberUtils.dollarsToCents(1.23)).toBe(123);
			expect(NumberUtils.dollarsToCents(1.234)).toBe(123);
			expect(NumberUtils.dollarsToCents(1.2345)).toBe(123);
			expect(NumberUtils.dollarsToCents(1.2346)).toBe(123);
			expect(NumberUtils.dollarsToCents(120.413)).toBe(12041);
			expect(NumberUtils.dollarsToCents(220.415)).toBe(22042);
		});
	});

	describe('centsToDollars', () => {
		it('should convert cents to dollars', () => {
			expect(NumberUtils.centsToDollars(0)).toBe(0);
			expect(NumberUtils.centsToDollars(100)).toBe(1);
			expect(NumberUtils.centsToDollars(1)).toBe(0.01);
			expect(NumberUtils.centsToDollars(123)).toBe(1.23);
			expect(NumberUtils.centsToDollars(124)).toBe(1.24);
			expect(NumberUtils.centsToDollars(125)).toBe(1.25);
			expect(NumberUtils.centsToDollars(12041)).toBe(120.41);
			expect(NumberUtils.centsToDollars(22042)).toBe(220.42);
		});
	});

	describe('round', () => {
		it('should round to significance', () => {
			expect(NumberUtils.round(0, 1)).toBe(0);
			expect(NumberUtils.round(1, 1)).toBe(1);
			expect(NumberUtils.round(0.1, 1)).toBe(1);
			expect(NumberUtils.round(0.1, 2)).toBe(2);
			expect(NumberUtils.round(0.9, 1)).toBe(1);
			expect(NumberUtils.round(0.9, 2)).toBe(2);
		});
	});

	describe('randomNumberInRange', () => {
		it('should return a random number within the range of 0 and your input value', () => {
			expect(NumberUtils.randomNumberInRange(0)).toBe(0);
			expect(NumberUtils.randomNumberInRange(1)).toBeLessThanOrEqual(1);
			expect(NumberUtils.randomNumberInRange(1)).toBeGreaterThanOrEqual(0);
			expect(NumberUtils.randomNumberInRange(10)).toBeLessThanOrEqual(10);
			expect(NumberUtils.randomNumberInRange(10)).toBeGreaterThanOrEqual(0);
			expect(NumberUtils.randomNumberInRange(100)).toBeLessThanOrEqual(100);
			expect(NumberUtils.randomNumberInRange(100)).toBeGreaterThanOrEqual(0);
		});
	});
});
