import { Dispatch, SetStateAction, useCallback, useState } from "@rbxts/roact";
import { useDeferCallback } from "../use-defer-callback";
import { useLatest } from "../use-latest";
import { useUnmountEffect } from "../use-unmount-effect";

const resolve = <T>(value: T | ((state: T) => T), state: T): T => {
	return typeIs(value, "function") ? value(state) : value;
};

/**
 * Like `useState`, but `setState` will update the state on the next Heartbeat
 * frame. Only the latest update in a frame will run.
 *
 * This is useful for improving performance when updating state in response to
 * events that fire rapidly in succession.
 *
 * @param initialState Optional initial state
 * @returns A tuple containing the state and a function to update it
 */
export function useDeferState<T>(
	initialState: T | (() => T),
): LuaTuple<[state: T, setState: Dispatch<SetStateAction<T>>]>;

export function useDeferState<T = undefined>(
	initialState?: void,
): LuaTuple<[state: T | undefined, setState: Dispatch<SetStateAction<T | undefined>>]>;

export function useDeferState<T>(
	initialState: T | (() => T),
): LuaTuple<[state: T, setState: Dispatch<SetStateAction<T>>]> {
	const [state, innerSetState] = useState<T>(initialState);
	const [deferredSetState, cancel] = useDeferCallback(innerSetState);

	const latestState = useLatest(state);

	// Wrap 'deferState' to allow multiple changes to state in one frame through
	// the `latestState` reference
	const setState = useCallback((value: SetStateAction<T>) => {
		latestState.current = resolve(value, latestState.current);
		deferredSetState(latestState.current);
	}, []);

	useUnmountEffect(cancel);

	return $tuple(state, setState);
}
