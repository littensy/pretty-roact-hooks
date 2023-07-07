import { useBinding, useEffect, useMemo } from "@rbxts/roact";
import { useCamera } from "../use-camera";
import { useEventListener } from "../use-event-listener";

/**
 * Returns the current viewport size of the camera.
 * @param listener Optional listener to be called when the viewport changes.
 * @returns A binding to the viewport size.
 */
export function useViewport(listener?: (viewport: Vector2) => void) {
	const camera = useCamera();
	const [viewport, setViewport] = useBinding(Vector2.one);

	useEventListener(camera?.GetPropertyChangedSignal("ViewportSize"), () => {
		setViewport(camera.ViewportSize);
		listener?.(camera.ViewportSize);
	});

	useMemo(() => {
		if (camera) {
			setViewport(camera.ViewportSize);
		}
	}, [camera]);

	useEffect(() => {
		listener?.(viewport.getValue());
	}, [camera]);

	return viewport;
}
