import DomUtils from '../DomUtils';
import { describe, expect, it } from 'vitest';

describe('DomUtils', () => {
	describe('addClass', () => {
		it('should add class', () => {
			const div = document.createElement('div');
			DomUtils.addClass(div, 'test');
			expect(div.className).toBe('test');
		});
	});

	describe('removeClass', () => {
		it('should remove class', () => {
			const div = document.createElement('div');
			div.className = 'test';
			DomUtils.removeClass(div, 'test');
			expect(div.className).toBe('');
		});
	});

	describe('removeClasses', () => {
		it('should remove classes', () => {
			const div = document.createElement('div');
			div.className = 'test1 test2 test3';
			DomUtils.removeClasses(div, ['test1', 'test3']);
			expect(div.className).toBe('test2');
		});
	});

	describe('hasClass', () => {
		it('should check if element has class', () => {
			const div = document.createElement('div');
			div.className = 'test';
			expect(DomUtils.hasClass(div, 'test')).toBe(true);
			expect(DomUtils.hasClass(div, 'test2')).toBe(false);
		});
	});

	describe('childrenWithClass', () => {
		it('should get children with class', () => {
			const div = document.createElement('div');
			const child1 = document.createElement('div');
			child1.className = 'test';
			const child2 = document.createElement('div');
			child2.className = 'test2';
			const child3 = document.createElement('div');
			child3.className = 'test';
			div.appendChild(child1);
			div.appendChild(child2);
			div.appendChild(child3);
			const children = DomUtils.childrenWithClass(div, 'test');
			expect(children.length).toBe(2);
			expect(children[0]).toBe(child1);
			expect(children[1]).toBe(child3);
		});
	});

	describe('firstChildWithClass', () => {
		it('should get first child with class', () => {
			const div = document.createElement('div');
			const child1 = document.createElement('div');
			child1.className = 'test';
			const child2 = document.createElement('div');
			child2.className = 'test2';
			const child3 = document.createElement('div');
			child3.className = 'test';
			div.appendChild(child1);
			div.appendChild(child2);
			div.appendChild(child3);
			const child = DomUtils.firstChildWithClass(div, 'test');
			expect(child).toBe(child1);
		});
	});

	describe('lastChildWithClass', () => {
		it('should get last child with class', () => {
			const div = document.createElement('div');
			const child1 = document.createElement('div');
			child1.className = 'test';
			const child2 = document.createElement('div');
			child2.className = 'test2';
			const child3 = document.createElement('div');
			child3.className = 'test';
			div.appendChild(child1);
			div.appendChild(child2);
			div.appendChild(child3);
			const child = DomUtils.lastChildWithClass(div, 'test');
			expect(child).toBe(child3);
		});
	});

	describe('validElement', () => {
		it('should check if element is valid', () => {
			expect(DomUtils.validElement(null)).toBe(false);
			expect(DomUtils.validElement(document.createElement('div'))).toBe(true);
		});
	});

	describe('parent', () => {
		it('should get parent element', () => {
			const div = document.createElement('div');
			const child = document.createElement('div');
			div.appendChild(child);
			expect(DomUtils.parent(child)).toBe(div);
		});
	});
});
