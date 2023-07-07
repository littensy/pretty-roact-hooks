import { Binding, createBinding, useMemo } from "@rbxts/roact";
import {
	JsxAnyInstanceChangeEvents,
	JsxAnyInstancePropertyBindings,
	JsxInstancePropertyName,
} from "../use-property/types";

/**
 * Tracks the state of multiple properties on an Instance. Returns the values and
 * a Change object that can be spread into the `Change` property of an element.
 * @param propertyNames The names of the properties to track.
 * @returns A tuple containing the values of the properties and a ref callback.
 */
export function usePropertyBinding<T extends JsxInstancePropertyName[]>(
	...propertyNames: T
): [...JsxAnyInstancePropertyBindings<T>, JsxAnyInstanceChangeEvents<T>] {
	const [bindings, bindingSetters] = useMemo(() => {
		const bindings: Binding<unknown>[] = [];
		const setBindings: ((value: unknown) => void)[] = [];

		propertyNames.forEach((property, index) => {
			const [binding, setBinding] = createBinding<unknown>(undefined);
			bindings[index] = binding;
			setBindings[index] = setBinding;
		});

		return [bindings, setBindings];
	}, propertyNames);

	const events = useMemo(() => {
		return propertyNames.reduce((events, property, index) => {
			events[property] = (rbx) => {
				bindingSetters[index](rbx[property as never]);
			};
			return events;
		}, {} as JsxAnyInstanceChangeEvents<T>);
	}, propertyNames);

	return useMemo(() => {
		const results = table.clone<unknown[]>(bindings);
		results[propertyNames.size()] = events;
		return results as [...JsxAnyInstancePropertyBindings<T>, JsxAnyInstanceChangeEvents<T>];
	}, [bindings, events]);
}
