import { useMemo } from "@rbxts/roact";
import { DebounceOptions, Debounced, debounce } from "@rbxts/set-timeout";
import { useLatest } from "../use-latest";
import { useUnmountEffect } from "../use-unmount-effect";

export interface UseDebounceOptions extends DebounceOptions {
	/**
	 * The amount of time to wait before the first call.
	 */
	wait?: number;
}

export interface UseDebounceResult<T extends Callback> {
	/**
	 * The debounced function.
	 */
	run: Debounced<T>;
	/**
	 * Cancels delayed invocations to the callback.
	 */
	cancel: () => void;
	/**
	 * Immediately invokes delayed callback invocations.
	 */
	flush: () => void;
	/**
	 * Returns whether any invocations are pending.
	 */
	pending: () => boolean;
}

/**
 * Creates a debounced function that delays invoking `callback` until after `wait`
 * seconds have elapsed since the last time the debounced function was invoked.
 * The `callback` is invoked with the last arguments provided to the debounced
 * function. Subsequent calls to the debounced function return the result of
 * the last `callback` invocation.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param callback The function to debounce.
 * @param options The options object.
 * @returns The new debounced function.
 */
export function useDebounceCallback<T extends Callback>(
	callback: T,
	options: UseDebounceOptions = {},
): UseDebounceResult<T> {
	const callbackRef = useLatest(callback);

	const debounced = useMemo(() => {
		return debounce(
			(...args: unknown[]) => {
				return callbackRef.current(...args);
			},
			options.wait,
			options,
		);
	}, []) as Debounced<T>;

	useUnmountEffect(() => {
		debounced.cancel();
	});

	return {
		run: debounced,
		cancel: debounced.cancel,
		flush: debounced.flush,
		pending: debounced.pending,
	};
}
