import Roact, { useBinding, useMemo } from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { useEventListener } from "../use-event-listener";
import { useMountEffect } from "../use-mount-effect";

/**
 * Returns a binding to the mouse position.
 * @param listener Optional listener to be called when the mouse position changes.
 * @returns A binding to mouse position.
 */
export function useMouse(listener?: (mouse: Vector2) => void): Roact.Binding<Vector2> {
	const [mouse, setMouse] = useBinding(Vector2.one);

	useEventListener(UserInputService.InputChanged, (input) => {
		if (
			input.UserInputType === Enum.UserInputType.MouseMovement ||
			input.UserInputType === Enum.UserInputType.Touch
		) {
			setMouse(UserInputService.GetMouseLocation());
			listener?.(UserInputService.GetMouseLocation());
		}
	});

	useMemo(() => {
		setMouse(UserInputService.GetMouseLocation());
	}, []);

	useMountEffect(() => {
		listener?.(mouse.getValue());
	});

	return mouse;
}
