import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectsPage from "@/app/projects/page";
import EditorPage from "@/app/editor/[project_id]/page";
import { DEFAULT_LOGO_URL, FAVICON_URLS } from "@/site/brand";
import { go, useRoute } from "./route";

document.title = "VusCut";

// Favicon: try the VUS logo links, fall back to the built-in logo.
function setFavicon(href: string) {
	for (const node of document.querySelectorAll("link[rel~='icon']")) {
		node.remove();
	}
	const link = document.createElement("link");
	link.rel = "icon";
	link.href = href;
	document.head.append(link);
}

function loadFavicon(index = 0) {
	if (index >= FAVICON_URLS.length) {
		setFavicon(DEFAULT_LOGO_URL);
		return;
	}
	const probe = new Image();
	probe.onload = () => setFavicon(FAVICON_URLS[index]);
	probe.onerror = () => loadFavicon(index + 1);
	probe.src = FAVICON_URLS[index];
}

loadFavicon();

// Ask the browser to keep saved projects safe (silent, no popup).
try {
	if (!navigator.userAgent.toLowerCase().includes("firefox")) {
		navigator.storage?.persist?.().catch(() => {});
	}
} catch {
	// ignore
}

function App() {
	const route = useRoute().split("?")[0];
	const isEditor = route.startsWith("/editor/");

	useEffect(() => {
		if (!isEditor && route !== "/projects") go("/projects", true);
	}, [isEditor, route]);

	return isEditor ? <EditorPage key={route} /> : <ProjectsPage />;
}

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
		>
			<TooltipProvider>
				<Toaster />
				<App />
			</TooltipProvider>
		</ThemeProvider>
	</StrictMode>,
);
