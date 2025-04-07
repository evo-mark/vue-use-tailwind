import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineConfig(({ mode }) => {
	const alias =
		mode === "development"
			? {
					"vue-use-tailwind": resolve("../src"),
				}
			: {};

	return {
		resolve: {
			alias,
		},
		base: "/vue-use-tailwind/",
		assetsDir: "",
		plugins: [
			vue({
				template: {
					transformAssetUrls,
				},
			}),
			vuetify(),
		],
	};
});
