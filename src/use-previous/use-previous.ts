import { useMemo, useRef } from "@rbxts/roact";

export type Predicate<T> = (previous: T | undefined, current: T) => boolean;

export const isStrictEqual = (a: unknown, b: unknown) => a === b;

/**
 * Returns the most recent value from the previous render. Returns `undefined`
 * on the first render.
 *
 * Takes an optional `predicate` function as the second argument that receives
 * the previous and current value. If the predicate returns `false`, the values
 * are not equal, and the previous value is updated.
 *
 * @param value The value to return on the next render if it changes.
 * @param predicate Optional function to determine whether the value changed.
 * Defaults to a strict equality check (`===`).
 * @returns The previous value.
 */
export function usePrevious<T>(value: T, predicate: Predicate<T> = isStrictEqual): T | undefined {
	const previousRef = useRef<T>();
	const currentRef = useRef<T>();

	useMemo(() => {
		if (!predicate(currentRef.current, value)) {
			previousRef.current = currentRef.current;
			currentRef.current = value;
		}
	}, [value]);

	return previousRef.current;
}
