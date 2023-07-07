import { GroupMotor, Instant, Linear, SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { useBinding, useCallback, useEffect, useMemo } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import {
	GroupMotorValue,
	MapValues,
	MotorState,
	groupMotorGetState,
	groupMotorImpulse,
	groupMotorSetState,
	motorGetState,
	motorImpulse,
	motorSetState,
} from "../utils/motor";

export type MotorGoal = Spring | Linear | Instant;

export interface SingleMotorApi {
	/**
	 * The motor instance.
	 */
	readonly motor: SingleMotor;
	/**
	 * Sets the state of the motor.
	 * @param state The state to set
	 */
	readonly setState: (state: Partial<MotorState>) => void;
	/**
	 * Gets the state of the motor.
	 * @returns The motor's state
	 */
	readonly getState: () => MotorState;
	/**
	 * Applies an impulse to the motor's velocity.
	 * @param impulse The impulse to apply
	 */
	readonly impulse: (impulse: number) => void;
}

export interface GroupMotorApi<T extends GroupMotorValue = GroupMotorValue> {
	/**
	 * The motor instance.
	 */
	readonly motor: GroupMotor<T>;
	/**
	 * Sets the state with the given keys in the group motor.
	 * @param state The state to set
	 */
	readonly setState: (states: Partial<MapValues<T, Partial<MotorState>>>) => void;
	/**
	 * Gets the state of every key in the group motor.
	 * @returns The group motor's state
	 */
	readonly getState: () => MapValues<T, MotorState>;
	/**
	 * Applies impulses to the motor's velocity.
	 * @param impulses The impulses to apply
	 */
	readonly impulse: (impulses: Partial<MapValues<T, number>>) => void;
}

/**
 * Creates a motor and returns a binding and a setter for the motor's goal.
 * Returns an additional API for changing the motor's state.
 * @param initialValue The initial value of the motor
 * @param useImplicitConnections Whether to use implicit connections
 * @returns A tuple containing the binding, setter, and API
 */
export function useMotor(
	initialValue: number,
	useImplicitConnections?: boolean,
): LuaTuple<[Roact.Binding<number>, (goal: MotorGoal) => void, SingleMotorApi]>;

export function useMotor<T extends GroupMotorValue>(
	initialValue: T,
	useImplicitConnections?: boolean,
): LuaTuple<[Roact.Binding<T>, (goal: Partial<MapValues<T, MotorGoal>>) => void, GroupMotorApi<T>]>;

export function useMotor(initialValue: number | GroupMotorValue, useImplicitConnections = true) {
	if (typeIs(initialValue, "number")) {
		return useSingleMotor(initialValue, useImplicitConnections);
	} else {
		return useGroupMotor(initialValue, useImplicitConnections);
	}
}

function useSingleMotor(initialValue: number, useImplicitConnections = true) {
	const motor = useMemo(() => {
		return new SingleMotor(initialValue, false);
	}, []);

	const api = useMemo<SingleMotorApi>(() => {
		return {
			motor,
			setState: (state) => motorSetState(motor, state),
			getState: () => motorGetState(motor),
			impulse: (impulse) => motorImpulse(motor, impulse),
		};
	}, []);

	const [binding, setBinding] = useBinding(initialValue);

	useEffect(() => {
		if (!useImplicitConnections) {
			const connection = motor.onStep(setBinding);

			return () => {
				connection.disconnect();
			};
		}

		const connection = RunService.Heartbeat.Connect((deltaTime) => {
			if (!motor.step(deltaTime)) {
				setBinding(motor.getValue());
			}
		});

		const onComplete = motor.onComplete(() => {
			setBinding(motor.getValue());
		});

		return () => {
			connection.Disconnect();
			onComplete.disconnect();
			motor.destroy();
		};
	}, [useImplicitConnections]);

	const setGoal = useCallback((goal: MotorGoal) => {
		motor.setGoal(goal);
	}, []);

	return $tuple(binding, setGoal, api);
}

function useGroupMotor<T extends GroupMotorValue>(initialValue: T, useImplicitConnections = true) {
	const motor = useMemo(() => {
		return new GroupMotor(initialValue, false);
	}, []);

	const api = useMemo<GroupMotorApi<T>>(() => {
		return {
			motor,
			setState: (states) => groupMotorSetState(motor, states),
			getState: () => groupMotorGetState(motor),
			impulse: (impulses) => groupMotorImpulse(motor, impulses),
		};
	}, []);

	const [binding, setBinding] = useBinding(initialValue);

	useEffect(() => {
		if (!useImplicitConnections) {
			const connection = motor.onStep(setBinding);

			return () => {
				connection.disconnect();
			};
		}

		const heartbeat = RunService.Heartbeat.Connect((deltaTime) => {
			if (!motor.step(deltaTime)) {
				setBinding(motor.getValue());
			}
		});

		const onComplete = motor.onComplete(() => {
			setBinding(motor.getValue());
		});

		return () => {
			heartbeat.Disconnect();
			onComplete.disconnect();
			motor.destroy();
		};
	}, [useImplicitConnections]);

	const setGoal = useCallback((goal: Partial<MapValues<T, MotorGoal>>) => {
		motor.setGoal(goal as never);
	}, []);

	return $tuple(binding, setGoal, api);
}
