<template>
	<v-btn
		:active="editor.isActive('bold')"
		active-color="primary"
		title="Bold"
		variant="plain"
		:icon="mdiFormatBold"
		@click="editor.chain().focus().toggleBold().run()"
	/>
	<v-btn
		:active="editor.isActive('italic')"
		active-color="primary"
		title="Italic"
		variant="plain"
		:icon="mdiFormatItalic"
		@click="editor.chain().focus().toggleItalic().run()"
	/>
	<v-btn
		:active="editor.isActive('underline')"
		active-color="primary"
		title="Underline"
		variant="plain"
		:icon="mdiFormatUnderline"
		@click="editor.chain().focus().toggleUnderline().run()"
	/>
	<VBtn
		:active="editor.isActive('strike')"
		active-color="primary"
		title="Strikethrough"
		variant="plain"
		:icon="mdiFormatStrikethroughVariant"
		@click="editor.chain().focus().toggleStrike().run()"
	/>
</template>

<script setup>
import { mdiFormatStrikethroughVariant, mdiFormatUnderline, mdiFormatItalic, mdiFormatBold } from "@mdi/js";

const { editor } = defineProps({
	editor: {
		type: Object,
		default: null,
	},
});
</script>
