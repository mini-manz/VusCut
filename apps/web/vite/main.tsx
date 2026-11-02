import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectsPage from "@/app/projects/page";
import EditorPage from "@/app/editor/[project_id]/page";
import { go, useRoute } from "./route";

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
