import { useEffect } from "@rbxts/roact";
import { UseThrottleOptions, useThrottleCallback } from "../use-throttle-callback";
import { useUpdate } from "../use-update";
import { useUpdateEffect } from "../use-update-effect";

/**
 * Creates a throttled effect that only runs at most once per every `wait`
 * seconds.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param effect The effect to throttle.
 * @param dependencies The dependencies array.
 * @param options The options object.
 */
export function useThrottleEffect(
	effect: () => (() => void) | void,
	dependencies?: unknown[],
	options?: UseThrottleOptions,
) {
	const update = useUpdate();

	const { run } = useThrottleCallback(update, options);

	useEffect(() => {
		return run();
	}, dependencies);

	useUpdateEffect(effect, [update]);
}
