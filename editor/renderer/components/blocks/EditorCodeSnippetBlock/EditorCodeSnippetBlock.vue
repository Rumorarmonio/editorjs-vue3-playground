<script setup lang="ts">
import type { CodeSnippetBlockData } from '~~/editor/shared'

defineProps<{
  data: CodeSnippetBlockData
}>()
</script>

<template>
  <figure :class="$style.codeSnippet">
    <figcaption
      v-if="data.caption"
      :class="$style.codeSnippetCaption"
    >
      {{ data.caption }}
    </figcaption>
    <pre :class="$style.codeSnippetPre"><code :class="$style.codeSnippetCode">{{ data.code }}</code></pre>
    <span :class="$style.codeSnippetLanguage">
      {{ data.language }}
    </span>
  </figure>
</template>

<style module lang="scss" src="./EditorCodeSnippetBlock.module.scss" />
