import { ref, watch, toValue, MaybeRefOrGetter, type Ref } from "vue";
import { type UserConfig, createElementObserver, createCompiler } from "./utils";
import { rebuild } from "./build";
type Compiler = ReturnType<typeof import("tailwindcss").compile>;

type GShadowRoot = typeof global.ShadowRoot.prototype;
interface ShadowRootExpose {
	shadow_root?: GShadowRoot;
}

export const useTailwind = (
	el: MaybeRefOrGetter<HTMLElement | ShadowRootExpose>,
	{ theme, plugins } = {} as UserConfig,
) => {
	let compiler: Compiler;
	const observer = ref();
	const isInit = ref(false);
	const classes: Ref<Set<string>> = ref(new Set());
	const lastCss = ref("");
	const sheet = ref(document.createElement("style"));
	const buildQueue = ref();
	const root = ref();

	const bootstrap = () => {
		if (!root.value) return (isInit.value = false);
		const styleObserver = new MutationObserver(() =>
			rebuild("full", { buildQueue, compiler, sheet, root, classes }),
		);

		compiler = createCompiler(root, { lastCss, classes, styleObserver, theme, plugins }) as Compiler;
		buildQueue.value = compiler;
		rebuild("full", { buildQueue, compiler, sheet, root, classes });
		root.value.appendChild(sheet.value);
		observer.value = createElementObserver(root, { styleObserver, sheet, compiler, buildQueue, classes });
	};

	watch(
		() => toValue(el),
		(maybeShadow) => {
			if (maybeShadow && !isInit.value) {
				if ("shadow_root" in maybeShadow) {
					root.value = maybeShadow.shadow_root;
				} else {
					root.value = maybeShadow;
				}
				bootstrap();
				isInit.value = true;
			}
		},
		{
			immediate: true,
		},
	);

	return {
		isInit,
		observer,
		root,
		classes,
	};
};
