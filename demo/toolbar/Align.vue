<template>
	<div v-if="editor" class="px-2">
		<VSelect
			v-model="selected"
			v-bind="$attrs"
			label="Align"
			:items="options"
			variant="plain"
			density="compact"
			hide-details
			clearable
			style="width: 200px"
		></VSelect>
	</div>
</template>

<script setup>
import { computed } from "vue";

defineOptions({
	inheritAttrs: false,
});
const { editor } = defineProps({
	editor: {
		type: Object,
		required: true,
	},
});

const options = [
	{
		title: "Left",
		value: "left",
	},
	{
		title: "Centre",
		value: "center",
	},
	{
		title: "Right",
		value: "right",
	},
	{
		title: "Justify",
		value: "justify",
	},
	{
		title: "Start",
		value: "start",
	},
	{
		title: "End",
		value: "end",
	},
];

const selected = computed({
	get() {
		if (editor.isActive({ textAlign: "left" })) return "left";
		else if (editor.isActive({ textAlign: "center" })) return "center";
		else if (editor.isActive({ textAlign: "right" })) return "right";
		else if (editor.isActive({ textAlign: "justify" })) return "justify";
		else if (editor.isActive({ textAlign: "start" })) return "start";
		else if (editor.isActive({ textAlign: "end" })) return "end";
		else return null;
	},
	set(v) {
		if (v) editor.chain().focus().setTextAlign(v).run();
		else editor.chain().focus().unsetTextAlign().run();
	},
});
</script>
