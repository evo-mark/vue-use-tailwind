import Bold from "@tiptap/extension-bold";
import { mergeAttributes } from "@tiptap/core";

// 2. Overwrite the keyboard shortcuts
const TailwindBold = Bold.extend({
	parseHTML() {
		return [
			{
				tag: "strong",
			},
			{
				tag: "span[class*=font-bold]",
			},
			{
				tag: "b",
				getAttrs: (node) => node.style.fontWeight !== "normal" && null,
			},
			{
				style: "font-weight=400",
				clearMark: (mark) => mark.type.name === this.name,
			},
			{
				style: "font-weight",
				getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: "font-bold",
			}),
			0,
		];
	},
});

export { TailwindBold };
