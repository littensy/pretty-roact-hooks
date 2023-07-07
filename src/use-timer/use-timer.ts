import Roact, { useBinding, useCallback, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useEventListener } from "../use-event-listener";

export interface Timer {
	/**
	 * A binding that represents the current value of the timer.
	 */
	readonly value: Roact.Binding<number>;
	/**
	 * Starts the timer if it is not already running.
	 */
	readonly start: () => void;
	/**
	 * Pauses the timer if it is running.
	 */
	readonly stop: () => void;
	/**
	 * Resets the timer to 0.
	 */
	readonly reset: () => void;
	/**
	 * Sets the timer to a specific value.
	 * @param value The value to set the timer to.
	 */
	readonly set: (value: number) => void;
}

/**
 * Creates a timer that can be used to track a value over time.
 * @param initialValue The initial value of the timer.
 * @returns A timer object.
 */
export function useTimer(initialValue = 0): Timer {
	const [value, setValue] = useBinding(initialValue);

	const started = useRef(true);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		if (started.current) {
			setValue(value.getValue() + deltaTime);
		}
	});

	const start = useCallback(() => {
		started.current = true;
	}, []);

	const stop = useCallback(() => {
		started.current = false;
	}, []);

	const reset = useCallback(() => {
		setValue(0);
	}, []);

	const set = useCallback((value: number) => {
		setValue(value);
	}, []);

	return { value, start, stop, reset, set };
}
