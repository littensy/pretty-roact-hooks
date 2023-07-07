import { useCallback, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useLatest } from "../use-latest";

/**
 * Defers a callback to be executed on the next Heartbeat frame. Consecutive
 * calls to the returned `execute` function will cancel the previous call.
 * @param callback The callback to defer
 * @returns A tuple containing the `execute` and `cancel` functions
 */
export function useDeferCallback<T extends unknown[]>(
	callback: (...args: T) => void,
): LuaTuple<[execute: (...args: T) => void, cancel: () => void]> {
	const callbackRef = useLatest(callback);
	const connectionRef = useRef<RBXScriptConnection>();

	const cancel = useCallback(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
	}, []);

	const execute = useCallback((...args: T) => {
		cancel();

		connectionRef.current = RunService.Heartbeat.Once(() => {
			connectionRef.current = undefined;
			callbackRef.current(...args);
		});
	}, []);

	return $tuple(execute, cancel);
}
