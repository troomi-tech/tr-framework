import { createElement } from 'react';
import { ToastOptions, toast } from 'react-toastify';
import ToastMessage, { ToastIconMap } from './toastMessage/ToastMessage';

export type ToastId = string | number;
export type ToastifyOptions = Omit<ToastOptions, 'type'>;
let icons: ToastIconMap = {
	error: 'icon-warning',
	info: 'icon-info',
	success: 'icon-check',
	warning: 'icon-warning',
	custom: 'icon-flag-icon'
};

/** @interface RsToastifyController */
interface RsToastifyController {
	/** Create a toast with the error type
	 *  @param {string} message @param {string} title if not provided, will default to 'Uh oh, something went wrong.'
	 *  @param {Partial<ToastifyOptions>} toastOptions @returns {ToastId} */
	error: (message: string, title?: string, toastOptions?: Partial<ToastifyOptions>) => ToastId;
	/** Create a toast with the info type
	 * @param {string} message @param {string} title if not provided, will default to 'Did you know?'
	 * @param {Partial<ToastifyOptions>} toastOptions @returns {ToastId} */
	info: (message: string, title?: string, toastOptions?: Partial<ToastifyOptions>) => ToastId;
	/** Create a toast with the success type
	 * @param {string} message @param {string} title if not provided, will default to 'Success!'
	 * @param {Partial<ToastifyOptions>} toastOptions @returns {ToastId} */
	success: (message: string, title?: string, toastOptions?: Partial<ToastifyOptions>) => ToastId;
	/** Create a toast with the warning type
	 * @param {string} message @param {string} title if not provided, will default to 'Warning'
	 * @param {Partial<ToastifyOptions>} toastOptions @returns {ToastId} */
	warning: (message: string, title?: string, toastOptions?: Partial<ToastifyOptions>) => ToastId;
	/** Create a toast with the custom type
	 * @param {string} message @param {string} title if not provided, will default to 'Warning'
	 * @param {Partial<ToastifyOptions>} toastOptions @returns {ToastId} */
	custom: (message: string, title: string, toastOptions?: Partial<ToastifyOptions>) => ToastId;

	/** If called, will override the default icons for all toasts called from `rsToastify`
	 * @param {Partial<ToastIconMap>} newIcons */
	setIcons: (newIcons: Partial<ToastIconMap>) => void;
	/** Remove toast programmaticaly @param {ToastId | undefined} id */
	close: (id: ToastId | undefined) => void;
}

/** A controller for the toastify library that uses the `ToastMessage` component.
 * @see https://fkhadra.github.io/react-toastify/introduction
 * @type {RsToastifyController} */
const rsToastify: RsToastifyController = {
	error: (message, title = 'Uh oh, something went wrong.', toastOptions) =>
		toast.error(createElement(ToastMessage, { title, message, icons, type: 'error' }), toastOptions),
	info: (message, title = 'Did you know?', toastOptions) =>
		toast.info(createElement(ToastMessage, { title, message, icons, type: 'info' }), toastOptions),
	success: (message, title = 'Success!', toastOptions) =>
		toast.success(createElement(ToastMessage, { title, message, icons, type: 'success' }), toastOptions),
	warning: (message, title = 'Warning', toastOptions) =>
		toast.warning(createElement(ToastMessage, { title, message, icons, type: 'warning' }), toastOptions),
	custom: (message, title, toastOptions) =>
		toast(createElement(ToastMessage, { title, message, icons, type: 'custom' }), toastOptions),

	setIcons: (newIcons) => (icons = { ...icons, ...newIcons }),
	close: toast.dismiss
};

export default rsToastify;
