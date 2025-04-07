import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve("./src/index.ts"),
			formats: ["es", "cjs"],
		},
		target: "esnext",
		rollupOptions: {
			external: [
				"vue",
				"tailwindcss",
				"tailwindcss/index.css?raw",
				"tailwindcss/preflight.css?raw",
				"tailwindcss/theme.css?raw",
				"tailwindcss/utilities.css?raw",
			],
		},
	},
	plugins: [],
});
