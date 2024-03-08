import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ObjectUtils } from '../../utils/Utils';

/** RedSky generic HTTP response data type */

export interface RsResponseData<T> {
	data: T;
}

/** RedSky generic HTTP error data type */

export interface RsErrorData {
	err: string;
	msg: string;
	status?: string;
	stack?: any;
}

/** HTTP client performs HTTP requests */

export default class HttpClient {
	private _config: AxiosRequestConfig;

	constructor(config?: AxiosRequestConfig) {
		this._config = config || {
			headers: {
				'Content-Type': 'application/json',

				'Access-Control-Allow-Origin': '*'
			}
		};
	}

	/**


     * Changes the current default config
     * @param {AxiosRequestConfig} config - New configuration
     */

	changeConfig(config: AxiosRequestConfig) {
		this._config = config;
	}

	/**
	 * Returns a clone copy of the current config
	 * @return {AxiosRequestConfig} Cloned copy of configuration for Axios
	 */

	currentConfig(): AxiosRequestConfig {
		return ObjectUtils.clone(this._config);
	}

	/**
	 * Send HTTP GET request to target URL
	 * @name get<T,U>
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} config
	 * @returns {Promise<AxiosResponse>}
	 */

	get<T, U = any>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		if (data) {
			url += '?' + ObjectUtils.serialize(data);
		}

		config = config ?? this._config;

		return axios.get<T>(url, config);
	}

	/**
	 * Send HTTP PUT request to target URL
	 * @name put<T,U>
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} config
	 * @returns {Promise<AxiosResponse>}
	 */

	put<T, U = any>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		config = config ?? this._config;

		return axios.put<T>(url, data, config);
	}

	/**
	 * Send HTTP PATCH request to target URL
	 * @name put<T,U>
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} config
	 * @returns {Promise<AxiosResponse>}
	 */

	patch<T, U = any>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		config = config ?? this._config;

		return axios.patch<T>(url, data, config);
	}

	/**
	 * Send HTTP POST request to target URL
	 * @name post<T,U>
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} config
	 * @returns {Promise<AxiosResponse>}
	 */

	post<T, U = any>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		config = config ?? this._config;

		return axios.post<T>(url, data, config);
	}

	/**
	 * Send HTTP DELETE request to target URL
	 * @name delete<T,U>
	 * @param {string} url
	 * @param {any} data
	 * @param {AxiosRequestConfig} config
	 * @returns {Promise<AxiosResponse>}
	 */

	delete<T, U = any>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		if (data) {
			url += '?' + ObjectUtils.serialize(data);
		}

		config = config ?? this._config;

		return axios.delete<T>(url, config);
	}

	/**
	 * Upload file to target URL using axios config
	 * @name upload
	 * @param {string} url
	 * @param {FormData} formData
	 * @param {File} file
	 * @param {(p: number) => void} progress
	 * @param {AxiosRequestConfig} config - alternative axios config to use
	 * @returns {Promise<AxiosResponse>}
	 */
	uploadAxios<T>(
		url: string,
		formData: FormData,
		file: File,
		progress?: (percent: number) => void,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<T>> {
		config = config ?? this._config;
		let updatedConfig = ObjectUtils.clone(config) as AxiosRequestConfig;
		updatedConfig.headers['Content-Type'] = 'multipart/form-data';
		if (progress)
			updatedConfig.onUploadProgress = (progressEvent) => {
				progress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
			};
		formData.append('file', file, file.name);
		return axios.post<T>(url, formData, updatedConfig);
	}

	/**
	 * @deprecated
	 * Upload file to target URL
	 * @name upload
	 * @param {string} url
	 * @param {any} data
	 * @param {File} file
	 * @param {(p: number) => void} progress
	 * @returns {Promise<string>}
	 */
	upload<T = any>(url: string, data: T, file: File, progress: (p: number) => void): Promise<string> {
		// @ts-ignore
		data.token = localStorage.token;

		return new Promise<string>((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();

			formData.append('file', file, file.name);

			for (let i in data) {
				if (!data[i]) continue;

				// @ts-ignore
				formData.append(i, data[i]);
			}

			xhr.open('POST', url, true);

			// @ts-ignore
			xhr.setRequestHeader('token', data.token);

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					resolve(xhr.responseText);
				}
			};

			xhr.onerror = function (err) {
				reject(err);
			};

			xhr.upload.onprogress = function (e) {
				if (progress) progress(Math.floor((e.loaded / e.total) * 100));
			};

			xhr.send(formData);
		});
	}
}
