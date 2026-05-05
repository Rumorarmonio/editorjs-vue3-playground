<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'header'>
}>()

function getHeaderTag(level: EditorBlock<'header'>['data']['level']): string {
  return `h${level}`
}
</script>

<template>
  <component
    :is="getHeaderTag(block.data.level)"
    :class="$style.heading"
  >
    <span v-html="sanitizeInlineHtml(block.data.text)" />
  </component>
</template>

<style module lang="scss" src="./EditorHeadingBlock.module.scss" />
