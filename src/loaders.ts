import { parseUserTheme, parseUserPlugins, type UserConfig } from "./utils";
import type { PluginCreator } from "tailwindcss/plugin";

import css from "./assets";

export async function loadModule(
	id: string,
	base: string,
	type: string,
	plugins: UserConfig["plugins"],
): Promise<{
	module: PluginCreator;
	base: string;
}> {
	if (type !== "plugin") {
		throw new Error(`useTailwind does not support config files.`);
	}

	const index = id.split("_").at(-1);
	if (index === undefined || !plugins) {
		throw new Error(`useTailwind encountered an error loading ${id}.`);
	}
	const resolvedPlugin = plugins[parseInt(index, 10)];
	if (resolvedPlugin) {
		return {
			base,
			module: resolvedPlugin ?? resolvedPlugin,
		};
	} else throw new Error(`useTailwind encountered an error loading ${id}.`);
}

export async function loadStylesheet(id: string, base: string, { theme, plugins }: UserConfig) {
	function load() {
		if (id === "tailwindcss") {
			const userTheme = parseUserTheme(theme);
			const pluginImports = parseUserPlugins(plugins);

			return {
				base,
				content: css.index + "\n" + userTheme + "\n" + pluginImports,
			};
		} else if (id === "tailwindcss/preflight" || id === "tailwindcss/preflight.css" || id === "./preflight.css") {
			return {
				base,
				content: css.preflight,
			};
		} else if (id === "tailwindcss/theme" || id === "tailwindcss/theme.css" || id === "./theme.css") {
			return {
				base,
				content: css.theme,
			};
		} else if (id === "tailwindcss/utilities" || id === "tailwindcss/utilities.css" || id === "./utilities.css") {
			return {
				base,
				content: css.utilities,
			};
		}

		throw new Error(`The browser build does not support @import for "${id}"`);
	}

	let sheet = load();

	return sheet;
}
