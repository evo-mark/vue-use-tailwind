import TextAlign from "@tiptap/extension-text-align";

// 2. Overwrite the keyboard shortcuts
const TailwindTextAlign = TextAlign.extend({
	addOptions() {
		return {
			types: [],
			alignments: ["left", "center", "right", "justify", "start", "end"],
			defaultAlignment: null,
		};
	},
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					textAlign: {
						default: this.options.defaultAlignment,
						parseHTML: (element) => {
							if (element.classList.contains("text-left")) return "left";
							else if (element.classList.contains("text-center")) return "center";
							else if (element.classList.contains("text-right")) return "right";
							else if (element.classList.contains("text-justify")) return "justify";
							else if (element.classList.contains("text-start")) return "start";
							else if (element.classList.contains("text-end")) return "end";
							else return this.options.defaultAlignment;
						},
						renderHTML: (attributes) => {
							if (!attributes.textAlign) {
								return {};
							}

							return { class: `text-${attributes.textAlign}` };
						},
					},
				},
			},
		];
	},
});

export { TailwindTextAlign };
