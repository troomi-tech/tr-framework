import DateUtils from '../DateUtils';
import { describe, expect, it } from 'vitest';

describe('DateUtils', () => {
	describe('daysBetweenStartAndEndDates', () => {
		it('should return the number of days between two dates', () => {
			expect(DateUtils.daysBetweenStartAndEndDates(new Date(2019, 0, 1), new Date(2019, 0, 3))).toBe(2);
			expect(DateUtils.daysBetweenStartAndEndDates(new Date(2019, 0, 1), new Date(2019, 0, 1))).toBe(0);
			expect(DateUtils.daysBetweenStartAndEndDates(new Date(2019, 0, 1), new Date(2019, 0, 2))).toBe(1);
		});
	});

	describe('formatDateForUser', () => {
		it('should format date for user', () => {
			expect(DateUtils.formatDateForUser('2023-10-03 21:54:50')).toBe('10-3-2023');
			expect(DateUtils.formatDateForUser(new Date(2019, 0, 1))).toBe('1-1-2019');
			expect(DateUtils.formatDateForUser('1/1/2019')).toBe('1-1-2019');
		});
	});

	describe('formatDate', () => {
		it('should format date', () => {
			expect(DateUtils.formatDate(new Date(2019, 0, 1))).toBe('1/1/2019');
			expect(DateUtils.formatDate('1/1/2019')).toBe('1/1/2019');
			expect(DateUtils.formatDate('2023-10-03 21:54:50')).toBe('10/3/2023');
			expect(DateUtils.formatDate(new Date(2019, 0, 1), { month: 'long', day: 'numeric' })).toBe('January 1');
			expect(DateUtils.formatDate('1/1/2019', { month: '2-digit', year: 'numeric' })).toBe('01/2019');
		});
	});

	describe('dbNow', () => {
		it("should return a proper date string from database insertion using now's time stamp", () => {
			expect(DateUtils.dbNow()).toBe(new Date().toISOString().slice(0, 19).replace('T', ' '));
		});
	});

	describe('hoursFromNow', () => {
		it('should return a proper Date string for a given hour offset', () => {
			const today = new Date();
			today.setTime(today.getTime() + 1 * (1000 * 60 * 60));
			expect(DateUtils.hoursFromNow(1)).toBe(DateUtils.clientToServerDateTime(today));
		});
	});

	describe('minutesFromNow', () => {
		it('should return a proper Date string for a given hour offset', () => {
			const today = new Date();
			today.setTime(today.getTime() + 1 * (1000 * 60));
			expect(DateUtils.minutesFromNow(1)).toBe(DateUtils.clientToServerDateTime(today));
		});
	});

	describe('daysInMonth', () => {
		it('should return the number of days in the given month and year', () => {
			expect(DateUtils.daysInMonth(1, 2019)).toBe(31);
			expect(DateUtils.daysInMonth(2, 2019)).toBe(28);
			expect(DateUtils.daysInMonth(3, 2020)).toBe(31);
			expect(DateUtils.daysInMonth(4, 2020)).toBe(30);
			expect(DateUtils.daysInMonth(5, 2021)).toBe(31);
		});
	});

	describe('padStart', () => {
		it('should pad a value with a leading zero', () => {
			expect(DateUtils.padStart('1')).toBe('01');
			expect(DateUtils.padStart('01')).toBe('01');
			expect(DateUtils.padStart('10')).toBe('10');
			expect(DateUtils.padStart('100')).toBe('100');
		});
	});

	describe('addDays', () => {
		it('should return a date object with a new range of days', () => {
			expect(DateUtils.addDays('2019/10/03', 1)).toStrictEqual(new Date('2019/10/04'));
			expect(DateUtils.addDays('2019/10/03', 365)).toStrictEqual(new Date('2020/10/02'));
			expect(DateUtils.addDays(new Date('2019/10/03'), 2)).toStrictEqual(new Date('2019/10/05'));
		});
	});

	describe('getDateRange', () => {
		it('should return a date range', () => {
			expect(DateUtils.getDateRange('2019/10/03', '2019/10/07')).toStrictEqual([
				'2019-10-03',
				'2019-10-04',
				'2019-10-05',
				'2019-10-06',
				'2019-10-07'
			]);
		});
	});

	describe('displayTime', () => {
		it('should return a time string', () => {
			expect(DateUtils.displayTime('2023-10-03 21:54:50')).toBe('9:54 pm');
			expect(DateUtils.displayTime(new Date(2019, 0, 1))).toBe('12:00 am');
			expect(DateUtils.displayTime('1/1/2019')).toBe('12:00 am');
		});
	});

	describe('displayDate', () => {
		it('should return a date string', () => {
			expect(DateUtils.displayDate('2023-10-03 21:54:50')).toBe('10/3/2023');
			expect(DateUtils.displayDate(new Date(2019, 0, 1))).toBe('1/1/2019');
			expect(DateUtils.displayDate('1/1/2019')).toBe('1/1/2019');
		});
	});

	describe('displayDayOfWeek', () => {
		it('should return a day of week string', () => {
			expect(DateUtils.displayDayOfWeek(new Date(2023, 10))).toBe('Wednesday');
			expect(DateUtils.displayDayOfWeek(new Date('2023/10/31'))).toBe('Tuesday');
			expect(DateUtils.displayDayOfWeek(new Date('1/1/2019'))).toBe('Tuesday');
		});
	});

	describe('isSameWeekAsCurrent', () => {
		it('should return true if date is in the same week as the current date', () => {
			expect(DateUtils.isSameWeekAsCurrent(new Date('2023-10-03 21:54:50'))).toBe(false);
			const today = new Date();
			expect(DateUtils.isSameWeekAsCurrent(today)).toBe(true);
		});
	});

	describe('isSameDayAsCurrent', () => {
		it('should return true if date is in the same day as the current date', () => {
			expect(DateUtils.isSameDayAsCurrent(new Date('2023-10-03 21:54:50'))).toBe(false);
			expect(DateUtils.isSameDayAsCurrent(new Date(2019, 0, 1))).toBe(false);
			const today = new Date();
			expect(DateUtils.isSameDayAsCurrent(today)).toBe(true);
		});
	});

	describe('isYesterday', () => {
		it('should return true if date is yesterday', () => {
			expect(DateUtils.isYesterday(new Date('2023-10-03 21:54:50'))).toBe(false);
			expect(DateUtils.isYesterday(new Date(2019, 0, 1))).toBe(false);
			expect(DateUtils.isYesterday(new Date('1/1/2019'))).toBe(false);
			const today = new Date();
			expect(DateUtils.isYesterday(today)).toBe(false);
			const yesterday = new Date().getTime() - 1 * (1000 * 60 * 60 * 24);
			expect(DateUtils.isYesterday(new Date(yesterday))).toBe(true);
		});
	});

	describe('dateFromString', () => {
		it('should return a proper date object from a string', () => {
			expect(DateUtils.dateFromString('2023-10-03 21:54:50')).toEqual(
				new Date('Tue Oct 03 2023 21:54:50 GMT-0600')
			);
		});
	});

	describe('isClientDate', () => {
		it('should return true if date is a client date', () => {
			expect(DateUtils.isClientDate(new Date())).toBe(true);
			expect(DateUtils.isClientDate(undefined)).toBe(false);
			expect(DateUtils.isClientDate(null)).toBe(false);
			expect(DateUtils.isClientDate(new Date(2019, 0, 1))).toBe(true);
			expect(DateUtils.isClientDate(new Date('1/1/2019'))).toBe(true);
		});
	});
});
