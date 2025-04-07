import { parseUserTheme, type UserConfig } from "./utils";
import css from "./assets";

export async function loadModule(): Promise<never> {
	throw new Error(`The browser build does not support plugins or config files.`);
}

export async function loadStylesheet(id: string, base: string, { theme }: UserConfig) {
	function load() {
		if (id === "tailwindcss") {
			const userTheme = parseUserTheme(theme);
			return {
				base,
				content: css.index + "\n" + userTheme,
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
