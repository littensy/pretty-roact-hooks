import { useCallback, useRef, useState } from "@rbxts/roact";
import { useUnmountEffect } from "../use-unmount-effect";

export type AsyncState<T> =
	| {
			status: PromiseConstructor["Status"]["Started"];
			message?: undefined;
			value?: undefined;
	  }
	| {
			status: PromiseConstructor["Status"]["Resolved"];
			message?: undefined;
			value: T;
	  }
	| {
			status: PromiseConstructor["Status"]["Cancelled"] | PromiseConstructor["Status"]["Rejected"];
			message: unknown;
			value?: undefined;
	  };

type AnyAsyncState<T> = {
	status: Promise.Status;
	message?: unknown;
	value?: T;
};

export type AsyncCallback<T, U extends unknown[]> = (...args: U) => Promise<T>;

/**
 * Returns a tuple containing the current state of the promise and a callback
 * to start a new promise. Calling it will cancel any previous promise.
 * @param callback The async callback.
 * @returns The state and a new callback.
 */
export function useAsyncCallback<T, U extends unknown[]>(
	callback: AsyncCallback<T, U>,
): LuaTuple<[AsyncState<T>, AsyncCallback<T, U>]> {
	const currentPromise = useRef<Promise<T>>();

	const [state, setState] = useState<AnyAsyncState<T>>({
		status: Promise.Status.Started,
	});

	const execute = useCallback(
		(...args: U) => {
			currentPromise.current?.cancel();

			if (state.status !== Promise.Status.Started) {
				setState({ status: Promise.Status.Started });
			}

			const promise = callback(...args);

			promise.then(
				(value) => setState({ status: promise.getStatus(), value }),
				(message: unknown) => setState({ status: promise.getStatus(), message }),
			);

			return (currentPromise.current = promise);
		},
		[callback],
	);

	useUnmountEffect(() => {
		currentPromise.current?.cancel();
	});

	return $tuple(state as AsyncState<T>, execute);
}
