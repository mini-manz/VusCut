import { useMemo } from "react";
import { go, parseHash, useRoute } from "../route";

const router = {
	push: (p: string) => go(p),
	replace: (p: string) => go(p, true),
	back: () => history.back(),
	forward: () => history.forward(),
	refresh: () => {},
	prefetch: () => {},
};

export const useRouter = () => router;

export const usePathname = () => useRoute().split("?")[0];

export const useParams = (): Record<string, string> => {
	const route = useRoute();
	return useMemo(() => {
		const m = route.split("?")[0].match(/^\/editor\/([^/]+)/);
		return m ? { project_id: decodeURIComponent(m[1]) } : {};
	}, [route]);
};

export const useSearchParams = () => {
	const route = useRoute();
	return useMemo(() => new URLSearchParams(route.split("?")[1] ?? ""), [route]);
};

export const notFound = (): never => {
	throw new Error("Not found");
};

export const redirect = (p: string): never => {
	go(p, true);
	throw new Error("Redirecting");
};

export { parseHash };
