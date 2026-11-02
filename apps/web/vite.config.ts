import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";

const here = import.meta.dirname;
const shim = (f: string) => path.resolve(here, "vite/shims", f);

export default defineConfig({
	root: here,
	base: "./",
	plugins: [react(), tailwindcss(), wasm()],
	resolve: {
		alias: [
			{ find: /^next\/link$/, replacement: shim("next-link.tsx") },
			{ find: /^next\/navigation$/, replacement: shim("next-navigation.ts") },
			{ find: /^next\/image$/, replacement: shim("next-image.tsx") },
			{
				find: /^content-collections$/,
				replacement: shim("content-collections.ts"),
			},
			{ find: /^@\//, replacement: `${path.resolve(here, "src")}/` },
		],
	},
	define: {
		"process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify("https://localhost"),
	},
	build: {
		outDir: path.resolve(here, "../../dist"),
		emptyOutDir: true,
		target: "esnext",
		cssCodeSplit: false,
		sourcemap: false,
		rollupOptions: {
			input: path.resolve(here, "vite/main.tsx"),
			output: {
				entryFileNames: "app.js",
				chunkFileNames: "chunks/[name]-[hash].js",
				assetFileNames: (a) =>
					a.names?.some((n) => n.endsWith(".css"))
						? "app.css"
						: "assets/[name]-[hash][extname]",
			},
		},
	},
});
