import Underline from "@tiptap/extension-underline";
import { mergeAttributes } from "@tiptap/core";

// 2. Overwrite the keyboard shortcuts
const TailwindUnderline = Underline.extend({
	parseHTML() {
		return [
			{
				tag: "u",
			},
			{
				tag: "span[class*=underline]",
			},
			{
				style: "text-decoration",
				consuming: false,
				getAttrs: (style) => (style.includes("underline") ? {} : false),
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: "underline",
			}),
			0,
		];
	},
});

export { TailwindUnderline };
