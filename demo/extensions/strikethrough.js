import Strikethrough from "@tiptap/extension-strike";
import { mergeAttributes } from "@tiptap/core";

// 2. Overwrite the keyboard shortcuts
const TailwindStrikethrough = Strikethrough.extend({
	parseHTML() {
		return [
			{
				tag: "s",
			},
			{
				tag: "del",
			},
			{
				tag: "strike",
			},
			{
				tag: "span[class*=line-through]",
			},
			{
				style: "text-decoration",
				consuming: false,
				getAttrs: (style) => (style.includes("line-through") ? {} : false),
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: "line-through",
			}),
			0,
		];
	},
});

export { TailwindStrikethrough };
