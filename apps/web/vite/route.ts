import { useSyncExternalStore } from "react";

// In-app routing only. The current "page" lives in memory, so the browser URL
// never changes (important for about:blank). There is no browser history, so
// the browser's own back/forward buttons have nothing to go to.

const DEFAULT_ROUTE = "/projects";

let current = DEFAULT_ROUTE;
const previous: string[] = [];
const listeners = new Set<() => void>();

const emit = () => {
	for (const listener of listeners) listener();
};

const subscribe = (cb: () => void) => {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
};

// Kept under this name because the next/navigation shim re-exports it.
export const parseHash = (): string => current;

export const useRoute = () =>
	useSyncExternalStore(subscribe, parseHash, () => DEFAULT_ROUTE);

export const go = (path: string, replace = false) => {
	const next = path.startsWith("/") ? path : `/${path}`;
	if (next === current) return;
	if (!replace) previous.push(current);
	current = next;
	emit();
};

export const back = () => {
	const last = previous.pop();
	if (last === undefined) return;
	current = last;
	emit();
};
