<script setup lang="ts">
import type { EditorContentBlock } from '~~/editor/shared'

defineProps<{
  block: EditorContentBlock
}>()
</script>

<template>
  <pre :class="$style.unsupported">{{ block }}</pre>
</template>

<style module lang="scss" src="./EditorUnsupportedBlock.module.scss" />
