import { useMemo, useState } from "@rbxts/roact";
import { JsxAnyInstanceChangeEvents, JsxAnyInstanceProperties, JsxInstancePropertyName } from "./types";

/**
 * Tracks the state of multiple properties on an Instance. Returns the values and
 * a Change object that can be spread into the `Change` property of an element.
 * @param propertyNames The names of the properties to track.
 * @returns A tuple containing the values of the properties and a ref callback.
 */
export function useProperty<T extends JsxInstancePropertyName[]>(
	...propertyNames: T
): [...JsxAnyInstanceProperties<T>, JsxAnyInstanceChangeEvents<T>] {
	const [values, setValues] = useState<JsxAnyInstanceProperties<T>>({});

	const events = useMemo(() => {
		return propertyNames.reduce((events, property, index) => {
			events[property] = (rbx) => {
				setValues((values) => {
					const update = table.clone<JsxAnyInstanceProperties<T>>(values);
					update[index] = rbx[property as never];
					return update;
				});
			};
			return events;
		}, {} as JsxAnyInstanceChangeEvents<T>);
	}, propertyNames);

	return useMemo(() => {
		const results = table.clone<unknown[]>(values);
		results[propertyNames.size()] = events;
		return results as [...JsxAnyInstanceProperties<T>, JsxAnyInstanceChangeEvents<T>];
	}, [values, events]);
}
