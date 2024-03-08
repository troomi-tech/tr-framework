/** Number related utilities */
export default class NumberUtils {
	/**
	 * @name dollarsToCents
	 * @param {dollars} dollars The floating point dollar value
	 * @returns {number} The integer number of cents
	 */
	static dollarsToCents(dollars: number): number {
		return parseInt((dollars * 100).toFixed(0));
	}

	/**
	 * centsToDollars
	 * @param {number} cents cent dollar value
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
		if (mod === 0) return num;

		return sign * (num - mod + significance);
	}

	/**
	 * Returns a random number within the range of 0 and your input value
	 * @param {number} maxLimit Max range input
	 * @returns {number} a random number between 0 and your max input value
	 */
	static randomNumberInRange(maxLimit: number): number {
		return Math.floor(Math.random() * Math.floor(maxLimit));
	}
}
