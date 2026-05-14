<script setup lang="ts">
import './EditorCodeSnippetBlock.highlight.scss'
import { highlightCode } from '~~/editor/renderer/helpers/highlight-code'
import type { CodeSnippetBlockData } from '~~/editor/shared'

const props = defineProps<{
  data: CodeSnippetBlockData
}>()

const highlightedCode = computed(() => {
  return highlightCode(props.data.code, props.data.language)
})
</script>

<template>
  <figure :class="$style.codeSnippet">
    <figcaption
      v-if="data.caption"
      :class="$style.codeSnippetCaption"
    >
      {{ data.caption }}
    </figcaption>
    <div :class="$style.codeSnippetFrame">
      <pre :class="$style.codeSnippetPre"><code
        :class="[$style.codeSnippetCode, 'hljs', `language-${data.language}`]"
        v-html="highlightedCode"
      /></pre>
      <span :class="$style.codeSnippetLanguage">{{ data.language }}</span>
    </div>
  </figure>
</template>

<style module lang="scss" src="./EditorCodeSnippetBlock.module.scss" />
