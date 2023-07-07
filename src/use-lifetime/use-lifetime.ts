import { useBinding, useEffect } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useEventListener } from "../use-event-listener";

/**
 * Returns the lifetime of the component in seconds. Updates every frame on
 * the Heartbeat event.
 *
 * If the dependency array is provided, the lifetime timer will reset when
 * any of the dependencies change.
 *
 * @param dependencies An optional array of dependencies to reset the timer.
 * @returns A binding of the component's lifetime.
 */
export function useLifetime(dependencies: unknown[] = []) {
	const [lifetime, setLifetime] = useBinding(0);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		setLifetime(lifetime.getValue() + deltaTime);
	});

	useEffect(() => {
		setLifetime(0);
	}, dependencies);

	return lifetime;
}
