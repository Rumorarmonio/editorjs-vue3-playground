<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'paragraph'>
  variant: 'default' | 'sectionIntro'
}>()
</script>

<template>
  <p
    :class="[
      $style.paragraph,
      variant === 'sectionIntro' ? $style.paragraphSectionIntro : '',
    ]"
    v-html="sanitizeInlineHtml(block.data.text)"
  />
</template>

<style module lang="scss" src="./EditorParagraphBlock.module.scss" />
