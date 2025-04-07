<template>
	<div class="relative">
		<input
			v-model="modelValue"
			:type="type"
			:id="fieldId"
			class="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-0"
			placeholder=" "
		/>
		<label
			:for="fieldId"
			class="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-orange-400 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
			>{{ label }}</label
		>
	</div>
</template>

<script setup>
import { useId, computed } from "vue";

const { label, type } = defineProps({
	label: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "text",
	},
});

const modelValue = defineModel({
	type: String,
	default: "",
});

const id = useId();
const fieldId = computed(() => `input_${id}`);
</script>
