import { useMemo, useRef } from "@rbxts/roact";
import { Predicate, isStrictEqual } from "../use-previous";

/**
 * Returns a mutable ref that points to the latest value of the input.
 *
 * Takes an optional `predicate` function as the second argument that receives
 * the previous and current value. If the predicate returns `false`, the values
 * are not equal, and the previous value is updated.
 *
 * @param value The value to track.
 * @returns A mutable reference to the value.
 */
export function useLatest<T>(value: T, predicate: Predicate<T> = isStrictEqual) {
	const ref = useRef(value);

	useMemo(() => {
		if (!predicate(ref.current, value)) {
			ref.current = value;
		}
	}, [value]);

	return ref;
}
