import { useEffect } from "@rbxts/roact";
import { UseDebounceOptions, useDebounceCallback } from "../use-debounce-callback";
import { useUpdate } from "../use-update";
import { useUpdateEffect } from "../use-update-effect";

/**
 * Creates a debounced effect that delays invoking `effect` until after `wait`
 * seconds have elapsed since the last time the debounced function was invoked.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param effect The effect to debounce.
 * @param dependencies The dependencies array.
 * @param options The options object.
 */
export function useDebounceEffect(
	effect: () => (() => void) | void,
	dependencies?: unknown[],
	options?: UseDebounceOptions,
) {
	const update = useUpdate();

	const { run } = useDebounceCallback(update, options);

	useEffect(() => {
		return run();
	}, dependencies);

	useUpdateEffect(effect, [update]);
}
