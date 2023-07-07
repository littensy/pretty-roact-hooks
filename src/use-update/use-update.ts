import { useCallback, useState } from "@rbxts/roact";

/**
 * Returns a function that can be used to force a component to update. The
 * function is recreated on the next render if called. This makes it useful as
 * a dependency for other hooks.
 * @returns A function that forces a rerender.
 */
export function useUpdate() {
	const [state, setState] = useState({});

	return useCallback(() => {
		setState({});
	}, [state]);
}
