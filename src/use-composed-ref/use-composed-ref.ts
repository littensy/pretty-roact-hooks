import { useMemo } from "@rbxts/roact";
import { useLatestCallback } from "../use-latest-callback";

export type RefFunction<T> = (rbx?: T) => void;

/**
 * Composes multiple ref functions into a single ref function and memoizes
 * the result.
 *
 * To prevent excess ref calls, the composed ref is only created once on mount.
 * However, it will call the latest refs passed, so it is safe to pass in refs
 * that might change.
 *
 * @param refs The ref functions to compose.
 * @returns A ref function that calls all of the ref functions passed in.
 */
export function useComposedRef<T>(...refs: (RefFunction<T> | undefined)[]): RefFunction<T> {
	const composedRef = useMemo(() => {
		return composeRefs(...refs);
	}, refs);

	// Make sure the function returned never changes when dependencies change.
	// Otherwise, the ref will be called again, and might cause other problems.
	return useLatestCallback(composedRef);
}

/**
 * Composes multiple ref functions into a single ref function.
 * @param refs The ref functions to compose.
 * @returns A ref function that calls all of the ref functions passed in.
 */
export function composeRefs<T>(...refs: (RefFunction<T> | undefined)[]): RefFunction<T> {
	const refsDefined = refs.filterUndefined();

	return (rbx) => {
		for (const ref of refsDefined) {
			ref(rbx);
		}
	};
}
