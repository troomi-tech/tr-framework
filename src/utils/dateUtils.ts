import { DAYS_OF_THE_WEEK } from './constants';

/** Date related utilities */
export default class DateUtils {
	/**
	 * Get number of days between a start and end date
	 * @param {Date | string} startDate
	 * @param {Date | string} endDate
	 * @returns {number} - Returns a number
	 */
	static daysBetweenStartAndEndDates(startDate: Date, endDate: Date): number {
		const differenceInTime = endDate.getTime() - startDate.getTime();
		return differenceInTime / (1000 * 3600 * 24);
	}

	/**
	 * Format a date for email templates
	 * @param {Date | string} date
	 * @returns {string} - Returns a string
	 */
	static formatDateForUser(date: string | Date): string {
		if (date === 'N/A') return date;
		const newDate = new Date(`${date}`);
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
	 * @returns {string} - Returns a string for datetime insertion into a database
	 */
	static dbNow(): string {
		return this.clientToServerDateTime(new Date());
	}
	/**
	 * Returns a proper Date string for a given hour offset
	 * @param {number} hours - The number of hours you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static hoursFromNow(hours: number): string {
		const today = new Date();
		today.setTime(today.getTime() + hours * (1000 * 60 * 60));
		return this.clientToServerDateTime(today);
	}
	/**
	 * Returns a proper Date string for a given hour offset
	 * @param {number} minutes - The number of minutes you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static minutesFromNow(minutes: number): string {
		const today = new Date();
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
	static addDays(date: Date | string, days: number): Date {
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
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		const dateRange: string[] = [];

		for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
			const formattedDate = currentDate.toISOString().split('T')[0];
			dateRange.push(formattedDate);
		}

		return dateRange;
	}

	/**
	 * Display time of input date time
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayTime(date: Date | string): string {
		if (typeof date === 'string') {
			const workingDate: Date | null = DateUtils.getDateFromString(date);
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
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDate(date: Date | string): string {
		if (typeof date === 'string') {
			const workingDate: Date | null = this.getDateFromString(date);
			if (workingDate == null) return date;
			date = workingDate;
		}
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();

		return `${month}/${day}/${year}`;
	}

	/**
	 * Display day of the week of the input date
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDayOfWeek(date: Date): string {
		return DAYS_OF_THE_WEEK[date.getDay()];
	}

	/**
	 * Check if input date is the same week as current date
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isSameWeekAsCurrent(date: Date): boolean {
		const current = new Date();
		let isSameWeek = true;
		isSameWeek &&= current.getFullYear() === date.getFullYear();
		isSameWeek &&= date.getFullYear() === current.getFullYear();
		isSameWeek &&= date.getMonth() === current.getMonth();
		isSameWeek &&= Math.abs(date.getDate() - current.getDate()) <= 6;
		isSameWeek &&= date.getDay() >= current.getDay();

		return isSameWeek;
	}

	/**
	 * Check if input date is the same day as current date
	 * @param {Date | string} date
	 * @returns {boolean}
	 */
	static isSameDayAsCurrent(date: Date | string): boolean {
		date = new Date(date);
		if (!date) return false;

		const current = new Date();
		if (current.getDate() !== date.getDate()) return false;
		if (current.getMonth() !== date.getMonth()) return false;
		if (current.getFullYear() !== date.getFullYear()) return false;

		return true;
	}

	/**
	 * Check if input date is yesterday
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isYesterday(date: Date): boolean {
		const currentDate = new Date();
		const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		const yesterdayMidnight = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() - 1
		);
		if (date.getTime() >= yesterdayMidnight.getTime() && date.getTime() <= todayMidnight.getTime()) return true;

		return false;
	}

	/**
	 * Convert client date time to server date time string
	 * @param {Date} date
	 * @returns {string}
	 */
	static clientToServerDateTime(date: Date): string {
		return date.toISOString().slice(0, 19).replace('T', ' ');
	}

	/**
	 * Convert client date to server date string
	 * @param {Date} date
	 * @returns {string}
	 */
	static clientToServerDate(date: Date): string {
		return date.toISOString().substring(0, 10);
	}

	/**
	 * Convert server date string to client date
	 * @param {string} dateStr
	 * @returns {Date | null}
	 */
	static serverToClientDate(dateStr: string): Date | null {
		if (!dateStr) return null;
		return new Date(dateStr.replace(/T.*Z/g, '').replace(/-/g, '/'));
	}

	/**
	 * Convert server date time string to client date time
	 * @param {string} dateStr
	 * @returns {Date | string}
	 */
	static serverToClientDateTime(dateStr: string): Date | string {
		const date = DateUtils.dateFromString(dateStr);
		if (!dateStr) return new Date();
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	}

	/**
	 * Conver date string to date object
	 * @param {string} dateStr
	 * @returns {Date}
	 */
	static dateFromString(dateStr: string): Date {
		dateStr = dateStr.replace('T', ' ').replace('Z', '');
		const a = dateStr.split(/[^0-9]/).map((s) => parseInt(s, 10));
		return new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
	}

	/**
	 * Check if input date is a client date object
	 * @param {unknown} date
	 * @returns {boolean}
	 */
	static isClientDate(date: unknown): boolean {
		if (!date) return false;
		if (typeof date !== 'object') return false;
		if ('getTime' in date && typeof date['getTime'] === 'function') return true;
		return false;
	}

	private static getDateFromString(dateString: string): Date | null {
		try {
			return new Date(dateString);
		} catch {
			return null;
		}
	}
}
