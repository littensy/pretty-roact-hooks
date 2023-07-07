import { Dispatch, SetStateAction, useState } from "@rbxts/roact";
import { UseDebounceOptions, useDebounceCallback } from "../use-debounce-callback";

/**
 * Delays updating `state` until after `wait` seconds have elapsed since the
 * last time the debounced function was invoked. Set to the most recently passed
 * `state` after the delay.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param initialState The value to debounce.
 * @param options The options object.
 * @returns A tuple containing the debounced value and a function to update it.
 */
export function useDebounceState<T>(
	initialState: T,
	options?: UseDebounceOptions,
): LuaTuple<[T, Dispatch<SetStateAction<T>>]> {
	const [state, setState] = useState(initialState);

	return $tuple(state, useDebounceCallback(setState, options).run);
}
