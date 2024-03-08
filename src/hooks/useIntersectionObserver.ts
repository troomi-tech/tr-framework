import { MutableRefObject, useCallback, useEffect, useState } from 'react';

export const DEFAULT_INTERSECTION_OPTIONS: IntersectionObserverInit = {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
};

/** A hook that uses the IntersectionObserver API to determine if a target element is in view.
 * @see[MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 * @param {MutableRefObject | Element | Null} target The target element to observe. Can take a ref or literal element.
 * @param {IntersectionObserverInit} options The options to pass to the IntersectionObserver.
 * @returns {boolean} A boolean indicating if the target element is in view. */
export default function useIntersectionObserver(
	target: MutableRefObject<any> | Element | null,
	options?: IntersectionObserverInit
): boolean {
	const [isInView, setIsInView] = useState<boolean>(false);

	const handleIntersectionEvent = useCallback((entries: IntersectionObserverEntry[]) => {
		const isIntersecting = !!entries.find((entry) => entry.isIntersecting);
		setIsInView(isIntersecting);
	}, []);

	useEffect(() => {
		const supportsIntersectionObserver = !!window.IntersectionObserver;
		if (!target || !supportsIntersectionObserver) return;
		const exactTarget = target instanceof Element ? target : target.current;
		if (!(exactTarget instanceof Element)) return;

		const observer = new IntersectionObserver(handleIntersectionEvent, {
			...DEFAULT_INTERSECTION_OPTIONS,
			...options
		});

		observer.observe(exactTarget);

		return () => observer.disconnect();
	}, [handleIntersectionEvent, target, options]);

	return isInView;
}
