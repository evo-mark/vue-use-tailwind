import { loadModule, loadStylesheet } from "./loaders";
import { compile } from "tailwindcss";

type Compiler = ReturnType<typeof import("tailwindcss").compile>;
interface ThemeConfigItem {
	isInline?: boolean;
	isStatic?: boolean;
	content: string;
}

export type UserConfig = {
	theme: string | string[] | ThemeConfigItem | ThemeConfigItem[];
};

export interface InstanceProperties {
	styleObserver: MutationObserver;
	sheet: Ref<HTMLStyleElement>;
	classes: Ref<Set<string>>;
	buildQueue: Ref<Promise<unknown>>;
	compiler: Compiler;
	root: Ref<HTMLElement>;
	theme: UserConfig["theme"];
	lastCss: Ref<string>;
}

import type { Ref } from "vue";
import { STYLE_TYPE } from "./constants";
import { rebuild } from "./build";

export function observeSheet(sheet: HTMLStyleElement, styleObserver: MutationObserver) {
	styleObserver.observe(sheet, {
		attributes: true,
		attributeFilter: ["type"],
		characterData: true,
		subtree: true,
		childList: true,
	});
}

export function parseThemeTag(item: string | ThemeConfigItem): string {
	if (item instanceof Object && item.isInline) {
		return "@theme inline";
	} else if (item instanceof Object && item.isStatic) {
		return "@theme static";
	} else {
		return "@theme";
	}
}

export function parseUserTheme(theme: UserConfig["theme"]): string {
	const themeArray = Array.isArray(theme) ? theme : [theme];

	return themeArray
		.reduce((acc: string[], curr: string | ThemeConfigItem): string[] => {
			const tag = parseThemeTag(curr);
			const content = typeof curr === "string" ? curr : curr.content;
			acc.push(`${tag} {
    ${content}
}`);
			return acc;
		}, [])
		.join("\n\n");
}

export function createElementObserver(
	root: Ref<HTMLElement>,
	{
		styleObserver,
		sheet,
		compiler,
		classes,
		buildQueue,
	}: Pick<InstanceProperties, "styleObserver" | "sheet" | "classes" | "buildQueue" | "compiler">,
) {
	return new MutationObserver((records) => {
		let full = 0;
		let incremental = 0;

		for (let record of records) {
			// New stylesheets == tracking + full rebuild
			for (let node of record.addedNodes) {
				if (node.nodeType !== Node.ELEMENT_NODE) continue;

				const element = node as Element;

				if (element.tagName !== "STYLE") continue;
				if (element.getAttribute("type") !== STYLE_TYPE) continue;

				const styleElement = element as HTMLStyleElement;

				observeSheet(styleElement, styleObserver);
				full++;
			}

			// New nodes require an incremental rebuild
			for (let node of record.addedNodes) {
				if (node.nodeType !== 1) continue;

				// Skip the output stylesheet itself to prevent loops
				if (node === sheet.value) continue;

				incremental++;
			}

			// Changes to class attributes require an incremental rebuild
			if (record.type === "attributes") {
				incremental++;
			}
		}

		if (full > 0) {
			return rebuild("full", { compiler, buildQueue, sheet, root, classes });
		} else if (incremental > 0) {
			return rebuild("incremental", { compiler, buildQueue, sheet, root, classes });
		}
	}).observe(root.value, {
		attributes: true,
		attributeFilter: ["class"],
		childList: true,
		subtree: true,
	});
}

export async function createCompiler(
	root: Ref<HTMLElement>,
	{
		lastCss,
		classes,
		styleObserver,
		theme,
	}: Pick<InstanceProperties, "classes" | "styleObserver" | "theme" | "lastCss">,
) {
	// The stylesheets may have changed causing a full rebuild so we'll need to
	// gather the latest list of stylesheets.
	let stylesheets: Iterable<HTMLStyleElement> = root.value.querySelectorAll(`style[type="${STYLE_TYPE}"]`);

	let css = "";
	for (let sheet of stylesheets) {
		observeSheet(sheet, styleObserver);
		css += sheet.textContent + "\n";
	}

	// The user might have no stylesheets, or a some stylesheets without `@import`
	// because they want to customize their theme so we'll inject the main import
	// for them. However, if they start using `@import` we'll let them control
	// the build completely.
	if (!css.includes("@import")) {
		css = `@import "tailwindcss";${css}`;
	}

	// The input CSS did not change so the compiler does not need to be recreated
	if (lastCss.value === css) return;

	lastCss.value = css;

	const compiler = await compile(css, {
		base: "/",
		loadStylesheet: async (id, base) => loadStylesheet(id, base, { theme }),
		loadModule,
	});

	classes.value.clear();
	return compiler;
}
