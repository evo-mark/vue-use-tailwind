import Italic from "@tiptap/extension-italic";
import { mergeAttributes } from "@tiptap/core";

// 2. Overwrite the keyboard shortcuts
const TailwindItalic = Italic.extend({
	parseHTML() {
		return [
			{
				tag: "em",
			},
			{
				tag: "span[class*=italic]",
			},
			{
				tag: "i",
				getAttrs: (node) => node.style.fontStyle !== "normal" && null,
			},
			{
				style: "font-style=normal",
				clearMark: (mark) => mark.type.name === this.name,
			},
			{
				style: "font-style=italic",
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: "italic",
			}),
			0,
		];
	},
});

export { TailwindItalic };
