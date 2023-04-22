import { Binding } from "@rbxts/roact";
import { useState } from "@rbxts/roact-hooked";
import { useBindingEffect } from "../use-binding-effect";
import { getBindingValue } from "../utils/binding";

/**
 * Returns the value of a binding. If the binding updates, the component will
 * be re-rendered. Non-binding values will be returned as-is.
 * @param binding The binding to get the value of.
 * @returns The value of the binding.
 */
export function useBindingState<T>(binding: T | Binding<T>): T {
	const [value, setValue] = useState(() => getBindingValue(binding));
	useBindingEffect(binding, setValue);
	return value;
}
