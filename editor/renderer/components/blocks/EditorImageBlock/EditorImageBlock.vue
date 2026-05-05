<script setup lang="ts">
import {
  getInlineText,
  sanitizeInlineHtml,
} from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'image'>
}>()
</script>

<template>
  <figure :class="$style.image">
    <img
      :alt="block.data.alt ?? getInlineText(block.data.caption ?? '')"
      :src="block.data.file.url"
    />
    <figcaption
      v-if="block.data.caption"
      v-html="sanitizeInlineHtml(block.data.caption)"
    />
  </figure>
</template>

<style module lang="scss" src="./EditorImageBlock.module.scss" />
