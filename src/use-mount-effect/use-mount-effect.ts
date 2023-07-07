import { useEffect } from "@rbxts/roact";

/**
 * Runs a callback when the component is mounted.
 * @param callback The callback to run.
 */
export function useMountEffect(callback: () => void) {
	useEffect(callback, []);
}
