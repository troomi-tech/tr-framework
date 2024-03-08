/** DOM related utilities */
export default class DomUtils {
	static addClass(element: Element | null, className: string): boolean {
		if (!DomUtils.validElement(element)) return false;
		element?.classList.add(className);
		return true;
	}
	static removeClass(element: Element | null, className: string): boolean {
		if (!DomUtils.validElement(element)) return false;
		element?.classList.remove(className);
		return true;
	}
	static removeClasses(element: Element | null, classes: string[]): boolean {
		if (!DomUtils.validElement(element)) return false;
		for (let i in classes) element?.classList.remove(classes[i]);
		return true;
	}

	/**
	 * Check if element has class
	 * @param {Element} element
	 * @param {string} className
	 * @returns {boolean}
	 */
	static hasClass(element: Element | null, className: string): boolean {
		if (!this.validElement(element)) return false;
		return !!element?.classList.contains(className);
	}

	/**
	 * Check if element has any of the classes
	 * @param {Element} element
	 * @param {string[]} classes
	 * @returns {boolean}
	 */
	static childrenWithClass(element: Element | null, className: string): Element[] {
		if (!element || !DomUtils.validElement(element)) return [];
		let children = [];
		for (let i in element.children) {
			if (DomUtils.hasClass(element?.children[i], className)) children.push(element?.children[i]);
		}
		return children;
	}

	/**
	 * Get the first child element with the given class name
	 * @param {Element} element the element to search
	 * @param {string} className the class name to search for
	 * @returns {Element | null} the first child element with the given class name
	 * @deprecated Use childrenWithClass instead
	 */
	static firstChildWithClass(element: HTMLElement | null | undefined, className: string): Element | null {
		if (!element) return null;
		for (let i in element.children) {
			if (DomUtils.hasClass(element.children[i], className)) return element.children[i];
		}
		return null;
	}

	/**
	 * Get the last child element with the given class name
	 * @param {Element} element the element to search
	 * @param {string} className the class name to search for
	 * @returns {Element | null} the last child element with the given class name
	 * @deprecated Use childrenWithClass instead
	 */
	static lastChildWithClass(element: Element, className: string): Element | null {
		if (!DomUtils.validElement(element)) return null;
		let last = null;
		for (let i in element?.children) {
			if (DomUtils.hasClass(element?.children[i], className)) last = element?.children[i];
		}
		return last;
	}

	/**
	 * Validates a given element is not null and has a classList
	 * @param {Element | null} element the element to validate
	 * @returns {boolean} true if element is valid
	 */
	static validElement(element: Element | null): boolean {
		if (!element) return false;
		if (!element.classList) return false;
		return true;
	}

	/**
	 * Get the parent element of the given element
	 * @param {Element} element the element to search
	 * @returns {Element | null} the parent element or null if not found
	 */
	static parent(element: Element | null): Element | null {
		if (!element) return null;
		return element.parentElement;
	}
}
