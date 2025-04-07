import type { InstanceProperties } from "./utils";

type Kind = "full" | "incremental";

export async function build(
	kind: Kind,
	{ compiler, sheet, root, classes }: Pick<InstanceProperties, "sheet" | "classes" | "compiler" | "root">,
) {
	if (!compiler) return;
	const instance = await compiler;

	// 1. Refresh the known list of classes
	let newClasses = new Set();

	for (let element of root.value.querySelectorAll("[class]")) {
		for (let c of element.classList) {
			if (classes.value.has(c)) continue;

			classes.value.add(c);
			newClasses.add(c);
		}
	}

	if (newClasses.size === 0 && kind === "incremental") return;

	// 2. Compile the CSS
	sheet.value.textContent = instance.build(Array.from(newClasses) as string[]);
}

export function rebuild(
	kind: Kind,
	{
		compiler,
		buildQueue,
		sheet,
		root,
		classes,
	}: Pick<InstanceProperties, "sheet" | "classes" | "compiler" | "root" | "buildQueue">,
) {
	async function run() {
		if (!compiler && kind !== "full") {
			return;
		}

		if (kind === "full") {
			await compiler;
		}

		await build(kind, { compiler, sheet, root, classes });
	}

	buildQueue.value = buildQueue.value.then(run);
}
