type UnknownFunction = (...args: any[]) => unknown;

/** Function related utilities */
export default class FunctionUtils {
	/**
	 * Gets the name of a function if it has one, otherwise returns the default name.
	 * If the function is a string, it will attempt to parse the name from the string.
	 * @param {UnknownFunction | string} func The function to get the name of
	 * @param {string} defaultName The default name to return if the function does not have a name
	 * @returns {string} The name of the function
	 */
	static getFunctionName(func: UnknownFunction | string, defaultName: string = ''): string {
		if (typeof func === 'string') {
			const funcName = func.match(/function\s+([^\s(]+)/);
			if (!funcName || !funcName[1]) return defaultName;
			return funcName[1];
		}

		if ('name' in func && !!func.name) return func.name;
		else if ('displayName' in func && !!func.displayName) return String(func.displayName);
		else if (
			'constructor' in func &&
			!!func.constructor &&
			'name' in func.constructor &&
			!!func.constructor.name &&
			func.constructor.name !== 'Function'
			// 'Function' is the default name for anonymous functions
		)
			return func.constructor.name;
		else return defaultName;
	}

	/**
	 * Get the parameters of a function
	 * @param {UnknownFunction | string} func The function to get the parameters of
	 * @returns {string[]} The parameters of the function
	 */
	static getFunctionParams(func: UnknownFunction | string): string[] {
		const funcStr = func.toString();
		const params = funcStr.match(/\(([^)]*)\)/);
		if (!params || !params[1]) return [];
		return params[1].split(',').map((p) => {
			if (p.includes('=')) return p.split('=')[0].trim();
			if (p.includes('...')) return p.replace('...', '').trim();
			return p.trim();
		});
	}

	/**
	 * Wrap a function with another function
	 * @param wrapper The wrapper function
	 * @param originalFn The original function
	 * @returns The wrapped function
	 */
	static wrapFunction<T, R>(
		wrapper: (originalFn: (...args: T[]) => R) => (...args: T[]) => R,
		originalFn: (...args: T[]) => R
	): (...args: T[]) => R {
		return wrapper(originalFn);
	}

	/**
	 * Syntax sugar for creating a asyncronous setTimeout
	 * @param {number} ms The number of milliseconds to wait
	 * @returns {Promise<void>} A promise that resolves after the timeout period
	 */
	static sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Retry a function until it succeeds or the number of retries is reached
	 * @param {() => Promise<T>} func The function to retry
	 * @param {number} retries The number of times to retry the function. default is 3
	 * @param {number} delay The delay between retries in milliseconds. default is 1000
	 * @param {number} backoff The backoff multiplier. default is 1
	 * @returns {Promise<T>} The result of the function
	 */
	static async retry<T>(
		func: () => Promise<T>,
		retries: number = 3,
		delay: number = 1000,
		backoff: number = 1
	): Promise<T> {
		try {
			return await func();
		} catch (err) {
			if (retries <= 1) throw err;
			await FunctionUtils.sleep(delay);
			return await this.retry(func, retries - 1, delay * backoff, backoff);
		}
	}
}
