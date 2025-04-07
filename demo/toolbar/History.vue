<template>
	<VBtnGroup density="comfortable">
		<v-btn v-tooltip="`Undo`" variant="plain" :icon="mdiUndo" :disabled="!canUndo" @click="undo" />
		<v-btn v-tooltip="`Redo`" variant="plain" :icon="mdiRedo" :disabled="!canRedo" @click="redo" />
		<VDivider vertical />
	</VBtnGroup>
</template>

<script setup>
import { mdiUndo, mdiRedo } from "@mdi/js";
import { computed } from "vue";

const { editor } = defineProps({
	editor: {
		type: Object,
		default: null,
	},
});

const canUndo = computed(() => editor && editor.can().undo());
const canRedo = computed(() => editor && editor.can().redo());

const undo = () => {
	if (!canUndo.value) return;
	editor.chain().focus().undo().run();
};

const redo = () => {
	if (!canRedo.value) return;
	editor.chain().focus().redo().run();
};
</script>
