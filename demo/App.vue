<template>
	<VApp>
		<VAppBar color="primary">
			<VAppBarTitle>Vue useTailwind</VAppBarTitle>
		</VAppBar>
		<VMain>
			<VContainer>
				<VCard title="Content Editor" class="mb-4">
					<VCardText>
						<header class="bg-grey-lighten-2 d-flex rounded-t px-1 pt-3 pb-2">
							<ToolbarHistory :editor="editor" />
							<ToolbarHeading :editor="editor" :heading-levels="headingLevels" />
							<ToolbarAlign :editor="editor" />
							<ToolbarFormatText v-if="editor" :editor="editor" />
						</header>
						<VInput class="input-wysiwyg" :focused="isFocused" :dirty="isDirty">
							<VField
								label="Example WYSIWYG"
								:active="isDirty || isFocused"
								:dirty="isDirty"
								:focused="isFocused"
							>
								<ShadowRoot ref="shadow" class="w-100">
									<EditorContent
										:editor="editor"
										class="input-wysiwyg__content prose v-field__input w-full px-4 pt-8 pb-4 *:outline-none *:focus-visible:outline-none"
									/>
								</ShadowRoot>
							</VField>
						</VInput>
					</VCardText>
				</VCard>

				<VCard class="mb-4" title="Current Classes">
					<VCardText>
						<div class="d-inline-flex ga-8 flex-wrap">
							<div v-for="className in classes">{{ className }}</div>
						</div>
						<div class="d-flex justify-center pt-8">
							<VAlert type="info" prominent variant="tonal" density="compact" style="max-width: 65ch">
								Note that the JIT compiler doesn't currently remove unused classes generated in this
								session.
							</VAlert>
						</div>
					</VCardText>
				</VCard>

				<VCard title="HTML Output">
					<VCardText>
						<code>
							<pre>{{ modelValue }}</pre>
						</code>
					</VCardText>
				</VCard>
			</VContainer>
		</VMain>
		<VFooter app color="primary">
			<VContainer> &copy; {{ new Date().getFullYear() }} Evo Mark Ltd </VContainer>
		</VFooter>
	</VApp>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import {
	TailwindTextAlign,
	TailwindHeading,
	TailwindBold,
	TailwindItalic,
	TailwindUnderline,
	TailwindStrikethrough,
} from "./extensions";
import StarterKit from "@tiptap/starter-kit";
import { ShadowRoot } from "vue-shadow-dom";
import { useTailwind } from "vue-use-tailwind";
import striptags from "striptags";
import ToolbarAlign from "./toolbar/Align.vue";
import ToolbarHeading from "./toolbar/Heading.vue";
import ToolbarHistory from "./toolbar/History.vue";
import ToolbarFormatText from "./toolbar/FormatText.vue";

import TailwindTypography from "@tailwindcss/typography";

const modelValue = useStorage("vue-use-tailwind", "", sessionStorage);

const shadowRef = useTemplateRef("shadow");

const isFocused = ref(false);
const isDirty = ref(false);

const headingLevels = [1, 2, 3, 4, 5, 6];

const editor = useEditor({
	extensions: [
		StarterKit.configure({
			history: {
				newGroupDelay: 2000,
			},
		}),
		TailwindTextAlign.configure({
			types: ["heading", "paragraph"],
		}),
		TailwindHeading.configure({
			heading: {
				levels: headingLevels,
			},
		}),
		TailwindBold,
		TailwindItalic,
		TailwindUnderline,
		TailwindStrikethrough,
	],
	content: modelValue.value,
	onBlur() {
		isFocused.value = false;
	},
	onFocus() {
		isFocused.value = true;
	},
	onUpdate({ editor: ctx }) {
		isDirty.value = !!striptags(ctx.getHTML());
		modelValue.value = ctx.getHTML();
	},
	onCreate({ editor: ctx }) {
		isDirty.value = !!striptags(ctx.getHTML());
	},
});

const { classes } = useTailwind(shadowRef, {
	theme: [{ content: "--color-mint-500: oklch(0.72 0.11 178);" }],
	plugins: [TailwindTypography],
});
</script>

<style>
code {
	display: inline-block;
	background-color: black;
	color: white;
	padding: 8px;
	border-radius: 8px;
}
</style>
