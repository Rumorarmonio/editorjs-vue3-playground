<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'quote'>
}>()
</script>

<template>
  <blockquote :class="$style.quote">
    <p v-html="sanitizeInlineHtml(block.data.text)" />
    <footer
      v-if="block.data.caption"
      v-html="sanitizeInlineHtml(block.data.caption)"
    />
  </blockquote>
</template>

<style module lang="scss" src="./EditorQuoteBlock.module.scss" />
