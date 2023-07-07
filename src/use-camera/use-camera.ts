import { useState } from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { useEventListener } from "../use-event-listener";

/**
 * Returns the current camera. Updates when the current camera changes.
 * @returns A camera instance.
 */
export function useCamera() {
	const [camera, setCamera] = useState(Workspace.CurrentCamera!);

	useEventListener(Workspace.GetPropertyChangedSignal("CurrentCamera"), () => {
		if (Workspace.CurrentCamera) {
			setCamera(Workspace.CurrentCamera);
		}
	});

	return camera;
}
