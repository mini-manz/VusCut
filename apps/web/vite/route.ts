import { useSyncExternalStore } from "react";

export const parseHash = (): string => {
	const h = location.hash.replace(/^#/, "") || "/projects";
	return h.startsWith("/") ? h : `/${h}`;
};

const subscribe = (cb: () => void) => {
	addEventListener("hashchange", cb);
	return () => removeEventListener("hashchange", cb);
};

export const useRoute = () =>
	useSyncExternalStore(subscribe, parseHash, () => "/projects");

export const go = (path: string, replace = false) => {
	if (replace) location.replace(`#${path}`);
	else location.hash = path;
};
