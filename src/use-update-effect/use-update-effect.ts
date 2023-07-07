import { useEffect, useRef } from "@rbxts/roact";

/**
 * Runs a callback when the component is re-rendered. Does not run on the
 * first render.
 * @param effect The callback to run.
 * @param dependencies The dependencies to watch for changes.
 */
export function useUpdateEffect(effect: () => (() => void) | void, dependencies?: unknown[]) {
	const isMounted = useRef(false);

	useEffect(() => {
		if (isMounted.current) {
			return effect();
		} else {
			isMounted.current = true;
		}
	}, dependencies);
}
