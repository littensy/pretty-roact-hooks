import { useEffect } from "@rbxts/roact";
import { AsyncState, useAsyncCallback } from "../use-async-callback";

type AsyncStateTuple<T extends AsyncState<unknown>> = LuaTuple<
	[result: T["value"], status: T["status"], message: T["message"]]
>;

/**
 * Returns a tuple containing the result and status of a promise. When the
 * dependencies change, pending promises will be cancelled, and a new promise
 * will be started.
 * @param callback The async callback.
 * @param deps The dependencies to watch. Defaults to an empty array.
 * @returns The result and status of the promise.
 */
export function useAsync<T>(callback: () => Promise<T>, deps: unknown[] = []): AsyncStateTuple<AsyncState<T>> {
	const [state, asyncCallback] = useAsyncCallback(callback);

	useEffect(() => {
		asyncCallback();
	}, deps);

	return $tuple(state.value, state.status, state.message);
}
