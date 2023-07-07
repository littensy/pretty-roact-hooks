import { useCallback, useEffect, useRef } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { useLatestCallback } from "../use-latest-callback";

/**
 * Sets a timeout that runs the callback function after `delay` seconds. If
 * `delay` is `undefined`, the timeout is cleared. If the delay changes, the
 * timeout is reset.
 * @param callback The callback function to run.
 * @param delay The delay in seconds before the timeout.
 * @returns A function that clears the timeout.
 */
export function useTimeout(callback: () => void, delay?: number) {
	const callbackMemo = useLatestCallback(callback);
	const cancel = useRef<() => void>();

	const clear = useCallback(() => {
		cancel.current?.();
	}, []);

	useEffect(() => {
		if (delay === undefined) {
			return;
		}
		cancel.current = setTimeout(callbackMemo, delay);
		return clear;
	}, [delay]);

	return clear;
}
