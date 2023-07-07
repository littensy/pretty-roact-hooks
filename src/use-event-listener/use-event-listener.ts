import { useEffect } from "@rbxts/roact";
import { useLatest } from "../use-latest";

interface EventListenerOptions {
	/**
	 * Whether the event should be connected or not. Defaults to `true`.
	 */
	connected?: boolean;
	/**
	 * Whether the event should be disconnected after the first invocation.
	 * Defaults to `false`.
	 */
	once?: boolean;
}

type EventLike<T extends Callback = Callback> =
	| { Connect(callback: T): ConnectionLike }
	| { connect(callback: T): ConnectionLike }
	| { subscribe(callback: T): ConnectionLike };

type ConnectionLike = { Disconnect(): void } | { disconnect(): void } | (() => void);

const connect = (event: EventLike, callback: Callback): ConnectionLike => {
	if (typeIs(event, "RBXScriptSignal")) {
		// With deferred events, a "hard disconnect" is necessary to avoid causing
		// state updates after a component unmounts. Use 'Connected' to check if
		// the connection is still valid before invoking the callback.
		// https://devforum.roblox.com/t/deferred-engine-events/2276564/99
		const connection = event.Connect((...args: unknown[]) => {
			if (connection.Connected) {
				return callback(...args);
			}
		});
		return connection;
	} else if ("Connect" in event) {
		return event.Connect(callback);
	} else if ("connect" in event) {
		return event.connect(callback);
	} else if ("subscribe" in event) {
		return event.subscribe(callback);
	} else {
		throw "Event-like object does not have a supported connect method.";
	}
};

const disconnect = (connection: ConnectionLike) => {
	if (typeIs(connection, "function")) {
		connection();
	} else if (typeIs(connection, "RBXScriptConnection") || "Disconnect" in connection) {
		connection.Disconnect();
	} else if ("disconnect" in connection) {
		connection.disconnect();
	} else {
		throw "Connection-like object does not have a supported disconnect method.";
	}
};

/**
 * Subscribes to an event-like object. The subscription is automatically
 * disconnected when the component unmounts.
 *
 * If the event or listener is `undefined`, the event will not be subscribed to,
 * and the subscription will be disconnected if it was previously connected.
 *
 * The listener is memoized, so it is safe to pass a callback that is recreated
 * on every render.
 *
 * @param event The event-like object to subscribe to.
 * @param listener The listener to subscribe with.
 * @param options Options for the subscription.
 */
export function useEventListener<T extends EventLike>(
	event?: T,
	listener?: T extends EventLike<infer U> ? U : never,
	options: EventListenerOptions = {},
) {
	const { once = false, connected = true } = options;

	const listenerRef = useLatest(listener);

	useEffect(() => {
		if (!event || !listener || !connected) {
			return;
		}

		let canDisconnect = true;

		const connection = connect(event, (...args: unknown[]) => {
			if (once) {
				disconnect(connection);
				canDisconnect = false;
			}
			listenerRef.current?.(...args);
		});

		return () => {
			if (canDisconnect) {
				disconnect(connection);
			}
		};
	}, [event, connected, listener !== undefined]);
}
