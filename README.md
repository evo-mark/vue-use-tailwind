<p align="center">
    <a href="https://evomark.co.uk" target="_blank" alt="Link to evoMark's website">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--dark.svg">
          <source media="(prefers-color-scheme: light)" srcset="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg">
          <img alt="evoMark company logo" src="https://evomark.co.uk/wp-content/uploads/static/evomark-logo--light.svg" width="500">
        </picture>
    </a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/dm/vue-use-tailwind.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-use-tailwind"><img src="https://img.shields.io/npm/v/vue-use-tailwind.svg" alt="Version"></a>
  <a href="https://github.com/evo-mark/vue-use-tailwind/blob/main/LICENCE"><img src="https://img.shields.io/github/license/evo-mark/vue-use-tailwind?style=flat" alt="Licence"></a>
</p>

# Vue useTailwind

Bring Tailwind's JIT compiler to the browser with features designed around building your own WYSIWYG or CMS.

- Tailwind v4+
- Supports user-provided themes
- Supports user-provided plugins
- Use in the main DOM or in isolated Shadow DOM components
- Run multiple different instances on the same page
- Get a reactive list of your used classes

See demo at https://evo-mark.github.io/vue-use-tailwind/

> Not affiliated with the @vueuse project

## Install

```sh
pnpm add vue-use-tailwind
```

## Usage

Below is a basic example of **useTailwind** inside a shadow DOM.

No styles or CSS applied outside the shadow DOM will affect the editor content and a clean Tailwind stylesheet will be reactively applied to content inside the tiptap editor.

```html
<template>
	<ShadowRoot ref="shadow">
		<EditorContent :editor="editor" />
	</ShadowRoot>
</template>

<script setup>
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { ShadowRoot } from "vue-shadow-dom";
	import { useTailwind } from "vue-use-tailwind";

	const { classes } = useTailwind(shadowRef);

	const editor = useEditor({
		content: `<p class="text-orange-400">I'm running Tiptap with Vue.js. 🎉</p>`,
		extensions: [StarterKit],
	});
</script>
```

### Theme config

You can also pass theme configuration CSS to **useTailwind**.

```js
const { classes } = useTailwind(shadowRef, {
	theme: [{ content: "--color-mint-500: oklch(0.72 0.11 178);" }],
});
```

The theme parameter can contain a string, an array of strings, or an array of ThemeConfigItems:

```ts
interface ThemeConfigItem {
	isInline?: boolean; // optional
	isStatic?: boolean; // optional
	content: string;
}
```

### Plugins

If you want your stylesheet to load additional plugins, you must pass them to the **useTailwind** composable:

```js
import { useTailwind } from "vue-use-tailwind";
import TailwindTypography from "@tailwindcss/typography";

const { classes } = useTailwind(shadowRef, {
	theme: "--color-mint-500: oklch(0.72 0.11 178);",
	plugins: [TailwindTypography],
});
```

> Note: Neither theme nor plugins are reactive.

## Support Open-Source Software

We're providing this package free-of-charge to the community. However, all development and maintenance costs time, energy and money. So please help fund this project if you can.

<p align="center" style="display:flex;align-items:center;gap:1rem;justify-content:center">
<a href="https://github.com/sponsors/craigrileyuk" target="_blank">
<img src="https://img.shields.io/badge/sponsor-GitHub%20Sponsors-fafbfc?style=for-the-badge&logo=github">
</a>
<a href="https://www.buymeacoffee.com/craigrileyuk" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
</p>

---

For full installation instructions and documentation, visit [evoMark](https://evomark.co.uk/open-source-software/vue-use-tailwind/) (coming soon).
