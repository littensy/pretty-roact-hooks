import { useMemo } from "@rbxts/roact";
import { Debounced, ThrottleOptions, throttle } from "@rbxts/set-timeout";
import { UseDebounceResult } from "../use-debounce-callback";
import { useLatest } from "../use-latest";
import { useUnmountEffect } from "../use-unmount-effect";

export interface UseThrottleOptions extends ThrottleOptions {
	/**
	 * The amount of time to wait before the first call.
	 */
	wait?: number;
}

/**
 * Creates a throttled function that only invokes `callback` at most once per
 * every `wait` seconds. The `callback` is invoked with the most recent arguments
 * provided to the throttled function. Subsequent calls to the throttled function
 * return the result of the last `callback` invocation.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `throttle` and `debounce`.
 *
 * @param callback The function to throttle.
 * @param options The options object.
 * @returns The new throttled function.
 */
export function useThrottleCallback<T extends Callback>(
	callback: T,
	options: UseThrottleOptions = {},
): UseDebounceResult<T> {
	const callbackRef = useLatest(callback);

	const throttled = useMemo(() => {
		return throttle(
			(...args: unknown[]) => {
				return callbackRef.current(...args);
			},
			options.wait,
			options,
		);
	}, []) as Debounced<T>;

	useUnmountEffect(() => {
		throttled.cancel();
	});

	return {
		run: throttled,
		cancel: throttled.cancel,
		flush: throttled.flush,
		pending: throttled.pending,
	};
}
