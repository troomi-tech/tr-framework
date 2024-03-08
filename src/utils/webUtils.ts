import { isValidElement } from 'react';
import ObjectUtils from './ObjectUtils';

/** Web development utilities */
export default class WebUtils {
	/**
	 * Get axios error message properly based on error type
	 * @param error the axios error from the catch()
	 */
	static getAxiosErrorMessage(error: unknown, defaultMessage: string = 'An unknown error occurred'): string {
		let errorResponse = defaultMessage;
		if (!error || typeof error !== 'object') return String(error);
		if ('response' in error && !!error.response && typeof error.response === 'object') {
			if ('data' in error.response && !!error.response.data && typeof error.response.data === 'object') {
				if ('msg' in error.response.data) errorResponse = String(error.response.data.msg);
				else if ('message' in error.response.data) errorResponse = String(error.response.data.message);
				else if ('err' in error.response.data) errorResponse = String(error.response.data.err);
				else if ('error' in error.response.data) errorResponse = String(error.response.data.error);
				else errorResponse = JSON.stringify(error.response.data);
			} else if ('data' in error.response && !!error.response.data && typeof error.response.data === 'string')
				errorResponse = error.response.data;
			else errorResponse = 'Unknown error message';
		} else if ('request' in error && !!error.request && typeof error.request === 'object') {
			if ('message' in error.request && !!error.request.message) errorResponse = String(error.request.message);
			else if ('statusText' in error.request && !!error.request.statusText)
				errorResponse = String(error.request.statusText);
			else if ('status' in error.request && !!error.request.status) errorResponse = String(error.request.status);
			else errorResponse = 'Unknown error message';
		} else if ('message' in error && !!error.message) {
			errorResponse = String(error.message);
		} else if ('msg' in error && !!error.msg) {
			errorResponse = String(error.msg);
		} else if ('err' in error && !!error.err) {
			if (typeof error.err === 'string') errorResponse = error.err;
			else errorResponse = JSON.stringify(error.err);
		} else if ('error' in error && !!error.error) {
			if (typeof error.error === 'string') errorResponse = error.error;
			else errorResponse = JSON.stringify(error.error);
		}

		return errorResponse;
	}

	/**
	 * Checks a thrown error object from an axios request for the standard RedSky Error Message
	 * @param {unknown} error Error object thrown via axios
	 * @param {string} defaultMessage A message to use incase there wasn't one given
	 * @returns {string} The msg from the RsError object or the defaultMessage passed in
	 */
	static getRsErrorMessage(error: unknown, defaultMessage: string = 'An unknown error occurred'): string {
		const errorResponse = ObjectUtils.smartParse(WebUtils.getAxiosErrorMessage(error, defaultMessage));
		if (typeof errorResponse !== 'object') return errorResponse;
		if ('msg' in errorResponse) return String(errorResponse.msg);
		else if ('err' in errorResponse) return String(errorResponse.err);
		return defaultMessage;
	}

	/**
	 * Check if all images have been loaded
	 * @param {HTMLElement} parentNode the parent node to check for images
	 * @returns {boolean} true if all images have been loaded
	 */
	static areImagesLoaded(parentNode: HTMLElement): boolean {
		const imgElements = parentNode.querySelectorAll('img');
		for (let i = 0; i < imgElements.length; i += 1) {
			const img = imgElements[i];
			if (!img.complete) return false;
		}
		return true;
	}

	/**
	 * Check if it is in cordova app envrionment
	 * @returns {boolean}
	 */
	static isCordova(): boolean {
		const isCordovaApp =
			document.URL.indexOf('http://') === -1 &&
			document.URL.indexOf('https://') === -1 &&
			document.URL.indexOf('localhost:300') === -1;
		return isCordovaApp || 'cordova' in window;
	}

	/**
	 * takes an unknown value and returns it if it is a valid react node
	 * @param {unknown} value the value to parse
	 * @returns {React.ReactNode | null} the parsed value or null
	 */
	static parseToReactNode(value: unknown): React.ReactNode | null {
		try {
			if (isValidElement(value)) return value;
			if (typeof value === 'number') return String(value);
			if (typeof value === 'boolean') return String(value);
			if (typeof value === 'object' && !!value && 'toString' in value) return value.toString();
			return null;
		} catch (error) {
			return null;
		}
	}

	/**
	 * Get app platform name
	 * @returns {string} the platform name
	 */
	static getPlatform(): string {
		let platformId = 'web';
		if ('cordova' in window) {
			const cordova = window.cordova;
			if (!!cordova && typeof cordova === 'object' && 'platformId' in cordova)
				platformId = String(cordova.platformId);
		}
		return platformId;
	}

	/**
	 * Strips off all subdomains and returns just the base domain
	 * @param {string} url A url to parse such as truvision.ontrac.io
	 * @returns {string} The stripped domain such as "ontrac.io"
	 */
	static getDomain(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (url.indexOf('http') === -1) url = 'http://' + url;
		const hostname = new URL(url).hostname;
		if (hostname.includes('ontrac')) {
			return hostname.split('.')[0];
		}
		// Remove all subdomains
		const hostnameSplit = hostname.split('.').slice(-2);
		return hostnameSplit.join('.');
	}

	/**
	 * Returns the hostname of the url. example: https://www.youtube.com -> www.youtube.com
	 * @param {string} url Url of address
	 * @returns {string} Hostname of url or empty if url was empty
	 */
	static getHostname(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (!url.startsWith('http')) url = 'http://' + url;
		return new URL(url).hostname;
	}

	/**
	 * Returns the first subdomain of the url. example https://truvision.ontrac.io -> truvision
	 * @param {string} url
	 * @returns {string} First subdomain or an empty string
	 */
	static getFirstSubdomain(url: string): string {
		if (!url) return '';
		const hostname = this.getHostname(url);
		const hostnameSplit = hostname.split('.');
		if (hostnameSplit.length > 2) return hostnameSplit.splice(-3, 1)[0];
		return '';
	}

	/**
	 * Takes an object and stringifies any nested objects so they can be used in a url
	 * @param {T} data Must be typeof object
	 * @returns {string} A url encoded string
	 */
	static convertDataForUrlParams<T extends object>(data: T): string {
		if (!data || typeof data !== 'object') return '';
		// const result: any = {};
		// for (let key of Object.keys(data)) {
		// 	const value = data[key as keyof T];
		// 	if (typeof value === 'object') result[key] = JSON.stringify(value);
		// 	else result[key] = value;
		// }
		const result = ObjectUtils.mapObject(data, (value) => {
			if (typeof value === 'object') return JSON.stringify(value);
			return String(value);
		});
		return new URLSearchParams(result).toString();
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
