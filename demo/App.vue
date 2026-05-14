<template>
	<VApp>
		<VAppBar color="primary">
			<VAppBarTitle>Vue useTailwind</VAppBarTitle>
		</VAppBar>
		<VMain>
			<VContainer>
				<VCard title="Content Editor" class="mb-4">
					<VCardText>
						<header class="bg-grey-lighten-2 flex rounded-t px-1 pt-3 pb-2">
							<ToolbarHistory :editor="editor" />
							<ToolbarHeading :editor="editor" :heading-levels="headingLevels" />
							<ToolbarAlign :editor="editor" />
							<ToolbarFormatText v-if="editor" :editor="editor" />
							<VBtn
								v-tooltip="`Reload class generator`"
								variant="text"
								:icon="mdiRefresh"
								@click="reload"
							/>
						</header>
						<VInput ref="input" class="input-wysiwyg" :focused="isFocused" :dirty="isDirty">
							<VField
								label="Example WYSIWYG"
								:active="isDirty || isFocused"
								:dirty="isDirty"
								:focused="isFocused"
							>
								<ShadowRoot ref="shadow" class="w-100">
									<EditorContent
										:editor="editor"
										class="input-wysiwyg__content prose dark:prose-invert v-field__input w-full px-4 pt-8 pb-4 *:outline-none *:focus-visible:outline-none"
									/>
								</ShadowRoot>
								<BubbleMenu v-if="editor" :editor="editor" class=" z-50" :append-to="inputRef?.$el">
									<VBtnGroup>
										<VBtn class="px-2 py-1 transition-colors duration-300" active-color="primary" :active="editor.isActive('bold')" @click="editor.chain().focus().toggleBold().run()">Bold</VBtn>
										<VBtn class="px-2 py-1 transition-colors duration-300" active-color="primary" :active="editor.isActive('italic')" @click="editor.chain().focus().toggleItalic().run()">Italic</VBtn>
									</VBtnGroup>
								</BubbleMenu>
							</VField>
						</VInput>
					</VCardText>
					<div class="bg-teal-600"></div>
				</VCard>

				<VCard class="mb-4" title="Current Classes">
					<VCardText>
						<div class="inline-flex gap-4 flex-wrap">
							<div v-for="className in classes">{{ className }}</div>
						</div>
						<div class="flex justify-center pt-8">
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
import { BubbleMenu } from "@tiptap/vue-3/menus";

import TailwindTypography from "@tailwindcss/typography";
import { mdiRefresh } from "@mdi/js";

const modelValue = useStorage("vue-use-tailwind", "", sessionStorage);

const shadowRef = useTemplateRef("shadow");
const inputRef = useTemplateRef("input")

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

const { classes, reload } = useTailwind(shadowRef, {
	theme: [{ content: "--color-mint-500: oklch(0.72 0.11 178);" }],
	plugins: [TailwindTypography],
	safelist: ["bg-teal-500", "bg-teal-600"],
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
