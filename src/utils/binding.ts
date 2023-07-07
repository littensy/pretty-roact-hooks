import { Binding, createBinding, joinBindings } from "@rbxts/roact";
import { lerp } from "./math";

/**
 * @see https://github.com/Roblox/roact/blob/master/src/Binding.lua
 */
export interface BindingApi<T> {
	subscribe: (callback: (newValue: T) => void) => () => void;
	update: (newValue: T) => void;
	getValue: () => T;
}

export interface Lerpable<T> {
	Lerp: (this: T, to: T, alpha: number) => T;
}

export type BindingOrValue<T> = Binding<T> | T;

/**
 * Returns whether the given value is a binding.
 * @param value The value to check.
 * @returns Whether the value is a binding.
 */
export function isBinding<T>(value: T | Binding<T>): value is Binding<T>;
export function isBinding<T = unknown>(value: unknown): value is Binding<T>;
export function isBinding(value: unknown): value is Binding<unknown> {
	return typeIs(value, "table") && "getValue" in value && "map" in value;
}

/**
 * Converts a value to a binding. If the given value is already a binding, it
 * will be returned as-is.
 * @param value The value to convert.
 * @returns The converted binding.
 */
export function toBinding<T>(value: T | Binding<T>): Binding<T> {
	if (isBinding(value)) {
		return value;
	} else {
		const [result] = createBinding(value);
		return result;
	}
}

/**
 * Returns the value of a binding. If the given value is not a binding, it will
 * be returned as-is.
 * @param binding The binding to get the value of.
 * @returns The value of the binding.
 */
export function getBindingValue<T>(binding: T | Binding<T>): T {
	if (isBinding(binding)) {
		return binding.getValue();
	} else {
		return binding;
	}
}

/**
 * Maps a binding to a new binding. If the given value is not a binding, it will
 * be passed to the mapper function and returned as a new binding.
 * @param binding The binding to map.
 * @param callback The mapper function.
 * @returns The mapped binding.
 */
export function mapBinding<T, U>(binding: T | Binding<T>, callback: (value: T) => U): Binding<U> {
	if (isBinding(binding)) {
		return binding.map(callback);
	} else {
		const [result] = createBinding(callback(binding as T));
		return result;
	}
}

/**
 * Joins a map of bindings into a single binding. If any of the given values
 * are not bindings, they will be wrapped in a new binding.
 * @param bindings The bindings to join.
 * @returns The joined binding.
 */
export function joinAnyBindings<T extends Readonly<Record<string, unknown>>>(
	bindings: T,
): Binding<{ [K in keyof T]: T[K] extends BindingOrValue<infer U> ? U : T[K] }>;
export function joinAnyBindings<T extends readonly unknown[]>(
	bindings: T,
): Binding<{ [K in keyof T]: T[K] extends BindingOrValue<infer U> ? U : T[K] }>;
export function joinAnyBindings(bindings: Record<string | number, unknown>): Binding<unknown> {
	const bindingsToMap = {} as Record<string | number, Binding<unknown>>;

	for (const [k, v] of pairs(bindings)) {
		bindingsToMap[k] = toBinding(v);
	}

	return joinBindings(bindingsToMap);
}

/**
 * Gets the internal API of a binding. This is a hacky way to get access to the
 * `BindingInternalApi` object of a binding, which is not exposed by Roact.
 * @param binding The binding to get the internal API of.
 * @returns The binding's API.
 */
export function getBindingApi<T>(binding: Binding<T>) {
	for (const [key, value] of pairs(binding)) {
		const name = tostring(key);

		if (name === "Symbol(BindingImpl)" || name.sub(1, 12) === "RoactBinding") {
			return value as unknown as BindingApi<T>;
		}
	}
}

/**
 * Returns a binding that lerps between two values using the given binding as
 * the alpha.
 * @param binding The binding to use as the alpha.
 * @param from The value to lerp from.
 * @param to The value to lerp to.
 * @returns A binding that lerps between two values.
 */
export function lerpBinding<T extends number | Lerpable<any>>(
	binding: Binding<number> | number,
	from: T,
	to: T,
): Binding<T> {
	return mapBinding(binding, (alpha) => {
		if (typeIs(from, "number")) {
			return lerp(from, to as number, alpha);
		} else {
			return from.Lerp(to, alpha);
		}
	});
}
