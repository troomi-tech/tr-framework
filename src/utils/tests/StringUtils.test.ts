import StringUtils from '../StringUtils';
import { describe, expect, it, vitest } from 'vitest';
import profanity from '../profanity';

describe('StringUtils', () => {
	const mockExecCommand = vitest.fn();
	Object.defineProperty(document, 'execCommand', { value: mockExecCommand });

	describe('convertTwentyFourHourTime', () => {
		it('should convert 24 time formated strings', () => {
			expect(StringUtils.convertTwentyFourHourTime('00:00')).toBe('12:00 AM');
			expect(StringUtils.convertTwentyFourHourTime('23:59')).toBe('11:59 PM');
			expect(StringUtils.convertTwentyFourHourTime('00:01')).toBe('12:01 AM');
			expect(StringUtils.convertTwentyFourHourTime('01:00')).toBe('1:00 AM');
			expect(StringUtils.convertTwentyFourHourTime('01:01')).toBe('1:01 AM');
			expect(StringUtils.convertTwentyFourHourTime('12:01')).toBe('12:01 PM');
			expect(StringUtils.convertTwentyFourHourTime('23:00')).toBe('11:00 PM');
			expect(StringUtils.convertTwentyFourHourTime('23:31')).toBe('11:31 PM');
		});
		it('should convert 24 hour numbers', () => {
			expect(StringUtils.convertTwentyFourHourTime(0)).toBe('12:00 AM');
			expect(StringUtils.convertTwentyFourHourTime(23.99)).toBe('11:59 PM');
			expect(StringUtils.convertTwentyFourHourTime(0.01)).toBe('12:01 AM');
			expect(StringUtils.convertTwentyFourHourTime(1)).toBe('1:00 AM');
			expect(StringUtils.convertTwentyFourHourTime(11)).toBe('11:00 AM');
			expect(StringUtils.convertTwentyFourHourTime(12)).toBe('12:00 PM');
		});
		it('should return empty string if input is invalid', () => {
			expect(StringUtils.convertTwentyFourHourTime('')).toBe('');
			expect(StringUtils.convertTwentyFourHourTime('24:00')).toBe('');
			expect(StringUtils.convertTwentyFourHourTime(24)).toBe('');
			expect(StringUtils.convertTwentyFourHourTime(32)).toBe('');
			expect(StringUtils.convertTwentyFourHourTime('T35T')).toBe('');
			expect(StringUtils.convertTwentyFourHourTime('32:44')).toBe('');
			expect(StringUtils.convertTwentyFourHourTime('12:4:4')).toBe('');
		});
	});

	describe('convertFrom12To24Format', () => {
		it('should convert 12 hour time formated strings', () => {
			expect(StringUtils.convertFrom12To24Format('12:00 AM')).toBe('00:00');
			expect(StringUtils.convertFrom12To24Format('11:59 PM')).toBe('23:59');
			expect(StringUtils.convertFrom12To24Format('12:01 AM')).toBe('00:01');
			expect(StringUtils.convertFrom12To24Format('1:00 AM')).toBe('01:00');
			expect(StringUtils.convertFrom12To24Format('1:01 AM')).toBe('01:01');
			expect(StringUtils.convertFrom12To24Format('12:01 PM')).toBe('12:01');
			expect(StringUtils.convertFrom12To24Format('11:00 PM')).toBe('23:00');
			expect(StringUtils.convertFrom12To24Format('11:31 PM')).toBe('23:31');
		});
	});

	describe('convertFromSecToHrMinFormat', () => {
		it('should convert seconds to hr min format', () => {
			expect(StringUtils.convertFromSecToHrMinFormat(0)).toBe('0 hr 0 min');
			expect(StringUtils.convertFromSecToHrMinFormat(60)).toBe('0 hr 1 min');
			expect(StringUtils.convertFromSecToHrMinFormat(61)).toBe('0 hr 1 min');
			expect(StringUtils.convertFromSecToHrMinFormat(3600)).toBe('1 hr 0 min');
			expect(StringUtils.convertFromSecToHrMinFormat(3661)).toBe('1 hr 1 min');
			expect(StringUtils.convertFromSecToHrMinFormat(86400)).toBe('24 hr 0 min');
		});
	});

	describe('convertFromMinToHrMinFormat', () => {
		it('should convert minutes to hr min format', () => {
			expect(StringUtils.convertFromMinToHrMinFormat(0)).toBe('0 hr 0 min');
			expect(StringUtils.convertFromMinToHrMinFormat(60)).toBe('1 hr 0 min');
			expect(StringUtils.convertFromMinToHrMinFormat(61)).toBe('1 hr 1 min');
			expect(StringUtils.convertFromMinToHrMinFormat(3600)).toBe('60 hr 0 min');
			expect(StringUtils.convertFromMinToHrMinFormat(3661)).toBe('61 hr 1 min');
			expect(StringUtils.convertFromMinToHrMinFormat(86400)).toBe('1440 hr 0 min');
		});
	});

	describe('convertFromSecToHrMinArray', () => {
		it('should convert seconds to hr min array', () => {
			expect(StringUtils.convertFromSecToHrMinArray(0)).toEqual(['0', '0']);
			expect(StringUtils.convertFromSecToHrMinArray(60)).toEqual(['0', '1']);
			expect(StringUtils.convertFromSecToHrMinArray(61)).toEqual(['0', '1']);
			expect(StringUtils.convertFromSecToHrMinArray(3600)).toEqual(['1', '0']);
			expect(StringUtils.convertFromSecToHrMinArray(3661)).toEqual(['1', '1']);
			expect(StringUtils.convertFromSecToHrMinArray(86400)).toEqual(['24', '0']);
		});
	});

	describe('removeLineEndings', () => {
		it('should remove line endings', () => {
			expect(StringUtils.removeLineEndings('test')).toBe('test');
			expect(StringUtils.removeLineEndings('test\ntest')).toBe('test test');
			expect(StringUtils.removeLineEndings('test\rtest')).toBe('test test');
			expect(StringUtils.removeLineEndings('test\ttest')).toBe('test test');
			expect(StringUtils.removeLineEndings('test\r\ttest')).toBe('test test');
			expect(StringUtils.removeLineEndings('test\n\t\t test\n test')).toBe('test test test');
			expect(StringUtils.removeLineEndings('test\r 	\ntest\r	\ntest')).toBe('test test test');
			expect(StringUtils.removeLineEndings('	test\r	test\r	test ')).toBe('test test test');
		});
	});

	describe('stringify', () => {
		it('should stringify anything', () => {
			expect(StringUtils.stringify('test')).toBe('test');
			expect(StringUtils.stringify(1)).toBe('1');
			expect(StringUtils.stringify(1.23)).toBe('1.23');
			expect(StringUtils.stringify(true)).toBe('true');
			expect(StringUtils.stringify(false)).toBe('false');
			expect(StringUtils.stringify(null)).toBe('null');
			expect(StringUtils.stringify(undefined)).toBe('undefined');
			expect(StringUtils.stringify({ test: 'test' })).toBe('{"test":"test"}');
			expect(StringUtils.stringify(new Date('2020-01-01'))).toBe(new Date('2020-01-01').toString());
			expect(StringUtils.stringify([1, 2, 3])).toBe([1, 2, 3].toString());
		});
	});

	describe('capitalizeFirst', () => {
		it('should capitalize first letter', () => {
			expect(StringUtils.capitalizeFirst('test')).toBe('Test');
			expect(StringUtils.capitalizeFirst('test test')).toBe('Test test');
			expect(StringUtils.capitalizeFirst('')).toBe('');
		});
	});

	describe('semVerToNumber', () => {
		it('should convert semver to number', () => {
			expect(StringUtils.semVerToNumber('1.0.0')).toBe(1_000_000);
			expect(StringUtils.semVerToNumber('1.0.1')).toBe(1_000_001);
			expect(StringUtils.semVerToNumber('1.1.0')).toBe(1_001_000);
			expect(StringUtils.semVerToNumber('1.2.3')).toBe(1_002_003);
			expect(StringUtils.semVerToNumber('1.23.0')).toBe(1_023_000);
			expect(StringUtils.semVerToNumber('1.100.0')).toBe(1_100_000);
		});
	});

	describe('isValidUrl', () => {
		it('should validate url', () => {
			expect(StringUtils.isValidUrl('https://www.google.com')).toBe(true);
			expect(StringUtils.isValidUrl('http://www.google.com')).toBe(true);
			expect(StringUtils.isValidUrl('www.google.com')).toBe(false);
			expect(StringUtils.isValidUrl('google.com')).toBe(false);
			expect(StringUtils.isValidUrl('google')).toBe(false);
			expect(StringUtils.isValidUrl('')).toBe(false);
		});
	});

	describe('intToBase36', () => {
		it('should convert int to base 36', () => {
			expect(StringUtils.intToBase36(0)).toBe('00000000');
			expect(StringUtils.intToBase36(1)).toBe('00000001');
			expect(StringUtils.intToBase36(10)).toBe('0000000A');
			expect(StringUtils.intToBase36(35)).toBe('0000000Z');
			expect(StringUtils.intToBase36(36)).toBe('00000010');
			expect(StringUtils.intToBase36(37)).toBe('00000011');
			expect(StringUtils.intToBase36(5135)).toBe('000003YN');
		});
	});

	describe('formatMoney', () => {
		it('should format money', () => {
			expect(StringUtils.formatMoney(0)).toBe('0.00');
			expect(StringUtils.formatMoney(1)).toBe('0.01');
			expect(StringUtils.formatMoney(10)).toBe('0.10');
			expect(StringUtils.formatMoney(123)).toBe('1.23');
			expect(StringUtils.formatMoney(1514)).toBe('15.14');
			expect(StringUtils.formatMoney(10000)).toBe('100.00');
			expect(StringUtils.formatMoney(100000)).toBe('1,000.00');
			expect(StringUtils.formatMoney(1000000)).toBe('10,000.00');
			expect(StringUtils.formatMoney(10000000)).toBe('100,000.00');
			expect(StringUtils.formatMoney(123456890)).toBe('1,234,568.90');
		});
	});

	describe('copyText', () => {
		it('should copy text to clipboard', () => {
			const targetElement = document.createElement('input');
			targetElement.value = 'test';
			targetElement.id = 'test';

			document.body.appendChild(targetElement);
			StringUtils.copyText('test');
			expect(mockExecCommand).toBeCalledWith('Copy');
		});
	});

	describe('copyToClipboard', () => {
		it('should copy text to clipboard', () => {
			StringUtils.copyToClipboard('test');
			expect(mockExecCommand).toBeCalledWith('copy');
		});
	});

	describe('isEmpty', () => {
		it('should return true if string is empty', () => {
			expect(StringUtils.isEmpty('')).toBe(true);
			expect(StringUtils.isEmpty(null)).toBe(true);
			expect(StringUtils.isEmpty(undefined)).toBe(true);
			expect(StringUtils.isEmpty('test')).toBe(false);
		});
	});

	describe('formatPriceRange', () => {
		it('should format price range', () => {
			expect(StringUtils.formatPriceRange('0-0')).toBe('$0.00');
			expect(StringUtils.formatPriceRange('0-1')).toBe('$0.01');
			expect(StringUtils.formatPriceRange('2-3')).toBe('$0.02-$0.03');
			expect(StringUtils.formatPriceRange('202-430')).toBe('$2.02-$4.30');
			expect(StringUtils.formatPriceRange('100-100')).toBe('$1.00');
			expect(StringUtils.formatPriceRange('0')).toBe('$0.00');
			expect(StringUtils.formatPriceRange('')).toBe('');
		});
	});

	describe('isBoolean', () => {
		it('should return true if string is boolean', () => {
			expect(StringUtils.isBoolean(true)).toBe(true);
			expect(StringUtils.isBoolean(false)).toBe(true);
			expect(StringUtils.isBoolean(1)).toBe(false);
			expect(StringUtils.isBoolean(0)).toBe(false);
			expect(StringUtils.isBoolean('true')).toBe(false);
			expect(StringUtils.isBoolean('false')).toBe(false);
			expect(StringUtils.isBoolean('1')).toBe(false);
			expect(StringUtils.isBoolean('0')).toBe(false);
			expect(StringUtils.isBoolean('')).toBe(false);
			expect(StringUtils.isBoolean('test')).toBe(false);
		});
	});

	describe('testRegex', () => {
		it('should return true if string matches regex', () => {
			expect(StringUtils.testRegex(/test/, 'test')).toBe(true);
			expect(StringUtils.testRegex(/test2/, 'test')).toBe(false);
		});
	});

	describe('generateGuid', () => {
		it('should generate guid', () => {
			expect(StringUtils.generateGuid().length).toBe(36);
			expect(StringUtils.generateGuid().split('-').length).toBe(5);
			expect(StringUtils.generateGuid().split('-')[2][0]).toBe('4');
			expect(StringUtils.generateGuid().split('-')[0].length).toBe(8);
			expect(StringUtils.generateGuid().split('-')[1].length).toBe(4);
			expect(StringUtils.generateGuid().split('-')[2].length).toBe(4);
			expect(StringUtils.generateGuid().split('-')[3].length).toBe(4);
			expect(StringUtils.generateGuid().split('-')[4].length).toBe(12);
		});
	});

	describe('filterProfanity', () => {
		it('should filter profanity', () => {
			expect(StringUtils.filterProfanity('test')).toBe('test');
			expect(StringUtils.filterProfanity(`test ${profanity[0]} test`)).toBe(`test 🤬 test`);
			expect(StringUtils.filterProfanity(`Test, ${profanity[1]}! test.`)).toBe(`Test, 🤬! test.`);
			expect(StringUtils.filterProfanity(`test ${profanity[3]}, ${profanity[4]} test`)).toBe(`test 🤬, 🤬 test`);
		});
	});

	describe('snakeCaseToHuman', () => {
		it('should convert snake case to human', () => {
			expect(StringUtils.snakeCaseToHuman('test')).toBe('Test');
			expect(StringUtils.snakeCaseToHuman('test_Test')).toBe('Test Test');
			expect(StringUtils.snakeCaseToHuman('test_Test_test')).toBe('Test Test Test');
			expect(StringUtils.snakeCaseToHuman('Test_test_Test')).toBe('Test Test Test');
			expect(StringUtils.snakeCaseToHuman('TEST_test_TEST')).toBe('TEST Test TEST');
		});
	});

	describe('addCommasToNumber', () => {
		it('should add commas to number', () => {
			expect(StringUtils.addCommasToNumber('invalid')).toBe('');
			expect(StringUtils.addCommasToNumber(0)).toBe('0');
			expect(StringUtils.addCommasToNumber('1')).toBe('1');
			expect(StringUtils.addCommasToNumber(12)).toBe('12');
			expect(StringUtils.addCommasToNumber('123')).toBe('123');
			expect(StringUtils.addCommasToNumber(1234)).toBe('1,234');
			expect(StringUtils.addCommasToNumber('12345')).toBe('12,345');
			expect(StringUtils.addCommasToNumber(123456)).toBe('123,456');
			expect(StringUtils.addCommasToNumber('1234567')).toBe('1,234,567');
			expect(StringUtils.addCommasToNumber(1.2345678)).toBe('1.2345678');
			expect(StringUtils.addCommasToNumber('1234.5678')).toBe('1,234.5678');
		});
	});

	describe('removeHtmlTags', () => {
		it('should remove html tags', () => {
			expect(StringUtils.removeHtmlTags('<p>test</p>')).toBe('test');
			expect(StringUtils.removeHtmlTags('<p class="test">test</p>')).toBe('test');
			expect(StringUtils.removeHtmlTags('<p>test</p><p>test</p>')).toBe('testtest');
			expect(StringUtils.removeHtmlTags('<label>test</label><input type="text" value="test" />')).toBe('test');
			expect(StringUtils.removeHtmlTags('<div class="test">test<p class="test">test</p></div>')).toBe('testtest');
		});
	});

	describe('removeIncorrectStringValues', () => {
		it('should remove incorrect string values', () => {
			expect(StringUtils.removeIncorrectStringValues(`🌟`)).toBe(``);
			expect(StringUtils.removeIncorrectStringValues('test')).toBe('test');
			expect(StringUtils.removeIncorrectStringValues(`test 🚀`)).toBe(`test`);
			expect(StringUtils.removeIncorrectStringValues(`🍕🌻 test`)).toBe(`test`);
			expect(StringUtils.removeIncorrectStringValues(`test 🌈 test`)).toBe(`test test`);
		});
	});

	describe('formatPhoneNumber', () => {
		it('should format phone number', () => {
			expect(StringUtils.formatPhoneNumber('')).toBe('');
			expect(StringUtils.formatPhoneNumber(123456)).toBe('123456');
			expect(StringUtils.formatPhoneNumber(1115556666)).toBe('(111) 555-6666');
			expect(StringUtils.formatPhoneNumber('3333333333')).toBe('(333) 333-3333');
			expect(StringUtils.formatPhoneNumber('333-333-3333')).toBe('(333) 333-3333');
			expect(StringUtils.formatPhoneNumber('(333) 333-3333')).toBe('(333) 333-3333');
		});
	});

	describe('validateNumberLength', () => {
		it('should validate number length', () => {
			expect(StringUtils.validateNumberLength('', 10)).toBe(false);
			expect(StringUtils.validateNumberLength('1234', 4)).toBe(true);
			expect(StringUtils.validateNumberLength('test', 4)).toBe(false);
			expect(StringUtils.validateNumberLength('12345678901', 10)).toBe(false);
			expect(StringUtils.validateNumberLength('(333) 333-3333', 10)).toBe(true);
		});
	});

	describe('removeAllExceptNumbers', () => {
		it('should remove all except numbers', () => {
			expect(StringUtils.removeAllExceptNumbers('')).toBe('');
			expect(StringUtils.removeAllExceptNumbers('test')).toBe('');
			expect(StringUtils.removeAllExceptNumbers('1234')).toBe('1234');
			expect(StringUtils.removeAllExceptNumbers('1234-5678')).toBe('12345678');
			expect(StringUtils.removeAllExceptNumbers('1234-5678-9012')).toBe('123456789012');
			expect(StringUtils.removeAllExceptNumbers('(123) 456-7890')).toBe('1234567890');
		});
	});

	describe('doubleDigit', () => {
		it('should add zeros to the left of a number', () => {
			expect(StringUtils.doubleDigit(0)).toBe('00');
			expect(StringUtils.doubleDigit('1')).toBe('01');
			expect(StringUtils.doubleDigit(9)).toBe('09');
			expect(StringUtils.doubleDigit('10')).toBe('10');
			expect(StringUtils.doubleDigit(11)).toBe('11');
			expect(StringUtils.doubleDigit('99')).toBe('99');
		});
	});

	describe('getChangedIndexes', () => {
		it('should return changed indexes', () => {
			expect(StringUtils.getChangedIndexes('test', 'test')).toEqual([]);
			expect(StringUtils.getChangedIndexes('test', 't_st')).toEqual([1]);
			expect(StringUtils.getChangedIndexes('_est', 'test')).toEqual([0]);
			expect(StringUtils.getChangedIndexes('test', 't__t')).toEqual([1, 2]);
			expect(StringUtils.getChangedIndexes('long test', 'short')).toEqual([]);
		});
	});

	describe('getCursorOffset', () => {
		it('should return cursor offset', () => {
			expect(StringUtils.getCursorOffset(3, 'test', 'test')).toBe(0);
			expect(StringUtils.getCursorOffset(5, '(123) 456-7890', '1234567890')).toBe(3);
			expect(StringUtils.getCursorOffset(9, '(123) 456-7890', '1234567890')).toBe(4);
			expect(StringUtils.getCursorOffset(13, '1234567890', '(123) 456-7890')).toBe(-4);
		});
	});

	describe('getInsertedPositions', () => {
		it('should return inserted positions', () => {
			expect(StringUtils.getInsertedPositions('test', 'test')).toEqual([]);
			expect(StringUtils.getInsertedPositions('test', 't_est')).toEqual([1]);
			expect(StringUtils.getInsertedPositions('test', 'te_st')).toEqual([2]);
			expect(StringUtils.getInsertedPositions('test', 'tes_t_')).toEqual([3, 5]);
			expect(StringUtils.getInsertedPositions('test', '_tes__t')).toEqual([0, 4, 5]);
		});
	});

	describe('getRemovedPositions', () => {
		it('should return removed positions', () => {
			expect(StringUtils.getRemovedPositions('test', 'test')).toEqual([]);
			expect(StringUtils.getRemovedPositions('test', 'tst')).toEqual([1]);
			expect(StringUtils.getRemovedPositions('test', 'tet')).toEqual([2]);
			expect(StringUtils.getRemovedPositions('test', 'tt')).toEqual([1, 2]);
			expect(StringUtils.getRemovedPositions('test', '')).toEqual([0, 1, 2, 3]);
		});
	});
});
