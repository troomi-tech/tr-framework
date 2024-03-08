import WebUtils from '../WebUtils';
import { describe, expect, it } from 'vitest';

describe('WebUtils', () => {
	describe('getAxiosErrorMessage', () => {
		it('should return the error message', () => {
			expect(WebUtils.getAxiosErrorMessage('test')).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({}, 'Default error msg')).toBe('Default error msg');
			expect(WebUtils.getAxiosErrorMessage({ response: {} })).toBe('Unknown error message');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: {} } })).toBe('{}');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: 'test' } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: { msg: 'test' } } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: { message: 'test' } } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: { err: 'test' } } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ response: { data: { error: 'test' } } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ request: { message: 'test' } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ request: { statusText: 'test' } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ request: { status: 'test' } })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ message: 'test' })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ msg: 'test' })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ err: 'test' })).toBe('test');
			expect(WebUtils.getAxiosErrorMessage({ error: 'test' })).toBe('test');
		});
	});

	describe('getRsErrorMessage', () => {
		it('should return the error message', () => {
			expect(WebUtils.getRsErrorMessage('test')).toBe('test');
			expect(WebUtils.getRsErrorMessage({}, 'Default error msg')).toBe('Default error msg');
			expect(WebUtils.getRsErrorMessage({ response: {} }, 'Default error msg')).toBe('Unknown error message');
			expect(WebUtils.getRsErrorMessage({ response: { data: { message: 'test' } } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ response: { data: { error: 'test' } } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ response: { data: { err: 'test' } } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ response: { data: { msg: 'test' } } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ request: { statusText: 'test' } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ request: { message: 'test' } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ request: { status: 'test' } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ response: { data: 'test' } })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ message: 'test' })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ error: 'test' })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ msg: 'test' })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ err: 'test' })).toBe('test');
			expect(WebUtils.getRsErrorMessage({ response: { data: {} } }, 'Default error msg')).toBe(
				'Default error msg'
			);
		});
	});

	describe('areImagesLoaded', () => {
		it('should check if all images have been loaded from the parent node', () => {
			const parentNode = document.createElement('div');
			expect(WebUtils.areImagesLoaded(parentNode)).toBe(true);
			const img = document.createElement('img');
			parentNode.appendChild(img);
			expect(WebUtils.areImagesLoaded(parentNode)).toBe(false);
		});
	});

	describe('isCordova', () => {
		it('should check if it is in cordova app envrionment', () => {
			expect(WebUtils.isCordova()).toBe(false);
			Object.defineProperty(window, 'cordova', { value: {}, writable: true });
			expect(WebUtils.isCordova()).toBe(true);
		});
	});

	describe('getPlatform', () => {
		it('should return the platform', () => {
			expect(WebUtils.getPlatform()).toBe('web');
			Object.defineProperty(window, 'cordova', {
				value: { platformId: 'test' },
				writable: true
			});
			expect(WebUtils.getPlatform()).toBe('test');
		});
	});

	describe('getDomain', () => {
		it('should return the domain', () => {
			expect(WebUtils.getDomain('https://test.com/test')).toBe('test.com');
			expect(WebUtils.getDomain('https://www.test.com')).toBe('test.com');
			expect(WebUtils.getDomain('http://test.com/test')).toBe('test.com');
			expect(WebUtils.getDomain('https://test.com')).toBe('test.com');
			expect(WebUtils.getDomain('http://test.com')).toBe('test.com');
		});
	});

	describe('getHostname', () => {
		it('should return the hostname', () => {
			expect(WebUtils.getHostname('https://www.test.com')).toBe('www.test.com');
			expect(WebUtils.getHostname('https://test.com/test')).toBe('test.com');
			expect(WebUtils.getDomain('http://test.com/test')).toBe('test.com');
			expect(WebUtils.getHostname('https://test.com')).toBe('test.com');
			expect(WebUtils.getDomain('http://test.com')).toBe('test.com');
		});
	});

	describe('getFirstSubdomain', () => {
		it('should return the first subdomain', () => {
			expect(WebUtils.getFirstSubdomain('https://parent.troomi.com/test')).toBe('parent');
			expect(WebUtils.getFirstSubdomain('https://sandbox.test.com')).toBe('sandbox');
			expect(WebUtils.getFirstSubdomain('http://test.t.com/test')).toBe('test');
			expect(WebUtils.getFirstSubdomain('https://www.test.com')).toBe('www');
			expect(WebUtils.getFirstSubdomain('http://test.com')).toBe('');
		});
	});

	describe('convertDataForUrlParams', () => {
		it('should convert data to url params', () => {
			expect(WebUtils.convertDataForUrlParams({})).toBe('');
			expect(WebUtils.convertDataForUrlParams({ test: 'test' })).toBe('test=test');
			expect(WebUtils.convertDataForUrlParams({ test: 'test', test2: 'test2' })).toBe('test=test&test2=test2');
			expect(WebUtils.convertDataForUrlParams({ test: 'test', test2: { test3: 'test3' } })).toBe(
				'test=test&test2=%7B%22test3%22%3A%22test3%22%7D'
			);
		});
	});

	describe('hasVideoExtension', () => {
		it('should check if the url has a video extension', () => {
			expect(WebUtils.hasVideoExtension('testfile.webp')).toBe(false);
			expect(WebUtils.hasVideoExtension('testfile.jpg')).toBe(false);
			expect(WebUtils.hasVideoExtension('testfile.3g2')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.3gp')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.3gpp')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.aaf')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.asf')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.avchd')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.avi')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.drc')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.flv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.m2v')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.m3u8')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.m4p')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.m4v')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mkv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mng')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mov')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mp2')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mp4')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mpe')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mpeg')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mpg')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mpv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.mxf')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.nsv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.ogg')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.ogv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.qt')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.rm')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.rmvb')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.roq')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.svi')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.vob')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.webm')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.wmv')).toBe(true);
			expect(WebUtils.hasVideoExtension('testfile.yuv')).toBe(true);
		});
	});
});
