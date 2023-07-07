import { useEffect } from "@rbxts/roact";
import { useDeferCallback } from "../use-defer-callback";

/**
 * Like `useEffect`, but the callback is deferred to the next Heartbeat frame.
 * @param callback The callback to run
 * @param dependencies Optional dependencies to trigger the effect
 */
export function useDeferEffect(callback: () => void, dependencies?: unknown[]) {
	const [deferredCallback, cancel] = useDeferCallback(callback);

	useEffect(() => {
		deferredCallback();
		return cancel;
	}, dependencies);
}
