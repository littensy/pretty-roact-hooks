import { InferEnumNames, useEffect, useMemo, useState } from "@rbxts/roact";
import { ContextActionService, HttpService, UserInputService } from "@rbxts/services";
import { useEventListener } from "../use-event-listener";

/**
 * A single key code name.
 */
export type KeyCode = InferEnumNames<Enum.KeyCode>;

/**
 * A single key code or a combination of key codes.
 */
export type KeyCodes = KeyCode | `${KeyCode}+${string}` | KeyCode[];

export interface KeyPressOptions {
	/**
	 * Whether to bind a ContextActionService action to the key press. If `true`,
	 * the action will be bound with the lifecycle of the component. The action will
	 * sink the input, so the game will not process it.
	 */
	bindAction?: boolean;
	/**
	 * The action priority to use when binding the action. Defaults to
	 * `Enum.ContextActionPriority.High.Value`.
	 */
	actionPriority?: number;
	/**
	 * The action name to use when binding the action. Defaults to a random name.
	 */
	actionName?: string;
	/**
	 * The input types and key codes to listen for. Defaults to `Enum.UserInputType.Keyboard`
	 * and `Enum.UserInputType.Gamepad1`.
	 */
	actionInputTypes?: (Enum.UserInputType | Enum.KeyCode)[];
}

/**
 * Returns whether the passed key or shortcut is pressed. The hook expects one
 * or more key code, which can be:
 *
 * - A single key code `"W"`
 * - A combination of key codes `"W+Space"`
 * - An array of key codes `["W", "Space"]`
 *
 * Each combination is treated as its own shortcut. If passed more than one
 * combination, the hook will return `true` if any of the combinations are
 * pressed.
 *
 * @param keyCodeCombos The key code or combination of key codes to listen for.
 * @returns Whether the key or combination of keys is pressed.
 */
export function useKeyPress(
	keyCodeCombos: KeyCodes[],
	{
		bindAction = false,
		actionPriority = Enum.ContextActionPriority.High.Value,
		actionName = bindAction ? HttpService.GenerateGUID(false) : "",
		actionInputTypes = [Enum.UserInputType.Keyboard, Enum.UserInputType.Gamepad1],
	}: KeyPressOptions = {},
) {
	const [pressed, setPressed] = useState(false);

	const keyCombos = useMemo(() => {
		return keyCodeCombos.map((keyCodes): KeyCode[] => {
			if (typeIs(keyCodes, "string")) {
				return keyCodes.split("+") as KeyCode[];
			} else {
				return keyCodes;
			}
		});
	}, keyCodeCombos);

	const keySet = useMemo(() => {
		const keySet = new Set<KeyCode>();

		for (const keys of keyCombos) {
			for (const key of keys) {
				keySet.add(key);
			}
		}

		return keySet;
	}, keyCombos);

	const keysDown = useMemo(() => {
		return new Set<KeyCode>();
	}, keyCodeCombos);

	const updatePressed = () => {
		setPressed(keyCombos.some((keys) => keys.every((key) => keysDown.has(key))));
	};

	useEventListener(UserInputService.InputBegan, (input, gameProcessed) => {
		if (!gameProcessed && keySet.has(input.KeyCode.Name)) {
			keysDown.add(input.KeyCode.Name);
			updatePressed();
		}
	});

	useEventListener(UserInputService.InputEnded, (input) => {
		if (keySet.has(input.KeyCode.Name)) {
			keysDown.delete(input.KeyCode.Name);
			updatePressed();
		}
	});

	useEffect(() => {
		// Prevents the game from processing the key
		if (!bindAction) {
			return;
		}

		ContextActionService.BindActionAtPriority(
			actionName,
			(_, state, input) => {
				const valid = keySet.has(input.KeyCode.Name);

				if (!valid) {
					return Enum.ContextActionResult.Pass;
				}

				if (state === Enum.UserInputState.Begin) {
					keysDown.add(input.KeyCode.Name);
				} else if (state === Enum.UserInputState.End) {
					keysDown.delete(input.KeyCode.Name);
				}

				updatePressed();

				return Enum.ContextActionResult.Sink;
			},
			false,
			actionPriority,
			...actionInputTypes,
		);

		return () => {
			ContextActionService.UnbindAction(actionName);
		};
	}, [bindAction, actionName, actionPriority]);

	return pressed;
}
