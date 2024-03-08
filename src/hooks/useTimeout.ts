import { useCallback, useDebugValue, useEffect, useRef } from 'react';

/**
 * Custom hook to set a timeout
 * @param callback Callback function to be called after timeout
 * @param {number} milliseconds Delay in milliseconds
 * @returns {reset, clear} Reset function to reset the timeout and clear function to clear the timeout
 * @example
 * const { reset, clear } = useTimeout(() => {
 *  console.log('Hello, World!');
 * }, 1000);
 *
 * <button onClick={reset}>
 * 	Show alert in 1 second
 * </button>
 * <button onClick={clear}>
 * 	Stop alert
 * </button>
 */
export default function useTimeout(
	callback: () => unknown,
	milliseconds: number
): { reset: () => void; clear: () => void } {
	// Add the delay to the hook name in React DevTools
	useDebugValue(milliseconds > 1000 ? `${milliseconds / 1000}s` : `${milliseconds}ms`);
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<number | null>(null);

	// Sets the timeoutRef to a new timeout
	const set = useCallback(() => {
		timeoutRef.current = window.setTimeout(callbackRef.current, milliseconds);
	}, [milliseconds]);

	// Calls clearTimeout on the the timoutRef
	const clear = useCallback(() => {
		if (!timeoutRef.current) return;
		clearTimeout(timeoutRef.current);
	}, []);

	// Clears the timeout and sets it to a new one
	const reset = useCallback(() => {
		clear();
		set();
	}, [clear, set]);

	// Set callback ref
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Clear timeout if the component is unmounted or the delay changes
	useEffect(() => {
		set();
		return clear;
	}, [milliseconds, set, clear]);

	return {
		reset,
		clear
	};
}
