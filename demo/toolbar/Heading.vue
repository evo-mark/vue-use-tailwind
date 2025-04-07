<template>
	<div class="px-2">
		<VSelect
			v-model="currentLevel"
			v-bind="$attrs"
			:items="headingLevelOptions"
			variant="plain"
			density="compact"
			hide-details
			label="Heading"
			clearable
			style="width: 150px"
			@update:model-value="editor.commands.toggleHeading({ level: $event })"
			@click:clear="onClearLevel"
		/>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";

defineOptions({
	inheritAttrs: false,
});

const { editor, headingLevels } = defineProps({
	editor: {
		type: Object,
		default: null,
	},
	headingLevels: {
		type: Array,
		required: true,
	},
});

/* *********************************************
 * HEADING LEVEL
 * ******************************************* */
const currentLevel = ref(null);

const headingLevelOptions = headingLevels.map((l) => ({
	value: l,
	title: `H${l}`,
}));
const onClearLevel = () => {
	editor.commands.toggleHeading({ level: currentLevel.value });
	currentLevel.value = null;
};

watch(
	headingLevels.map((heading) => () => editor?.isActive("heading", { level: heading })),
	(v, oldValues) => {
		if (!v) {
			const oldIndex = oldValues.findIndex((h) => h === true);
			editor.commands.toggleHeading({ level: oldIndex });
			return (currentLevel.value = null);
		}

		const idx = v.findIndex((h) => h === true);
		const activeLevel = headingLevels[idx];
		currentLevel.value = activeLevel;
	},
);
</script>
