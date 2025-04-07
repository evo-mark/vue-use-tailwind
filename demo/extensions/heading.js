import Heading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";

// 2. Overwrite the keyboard shortcuts
const TailwindHeading = Heading.extend({
	renderHTML({ node, HTMLAttributes }) {
		const hasLevel = this.options.levels.includes(node.attrs.level);
		const level = hasLevel ? node.attrs.level : this.options.levels[0];

		const className =
			{
				1: "text-5xl",
				2: "text-4xl",
				3: "text-3xl",
				4: "text-2xl",
				5: "text-xl",
				6: "text-base font-bold",
			}[level] ?? null;

		return [
			`h${level}`,
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: className,
			}),
			0,
		];
	},
});

export { TailwindHeading };
