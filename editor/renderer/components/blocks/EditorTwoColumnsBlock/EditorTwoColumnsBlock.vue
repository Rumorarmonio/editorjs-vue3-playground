<script setup lang="ts">
import { useCssModule } from 'vue'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import type {
  EditorBlock,
  EditorContentData,
  TwoColumnsBlockData,
  TwoColumnsContentData,
} from '~~/editor/shared'

defineProps<{
  data: TwoColumnsBlockData
}>()

const style = useCssModule()

function asEditorContentData(data: TwoColumnsContentData): EditorContentData {
  return data as EditorContentData
}

function getTwoColumnsLayoutClass(
  layout: EditorBlock<'twoColumns'>['data']['layout'],
): string | undefined {
  switch (layout) {
    case 'leftWide':
      return style.twoColumnsLeftWide
    case 'rightWide':
      return style.twoColumnsRightWide
    default:
      return undefined
  }
}
</script>

<template>
  <section
    :class="[
      $style.twoColumns,
      getTwoColumnsLayoutClass(data.layout),
      data.isReversed ? $style.twoColumnsReversed : '',
    ]"
  >
    <EditorContentRenderer
      v-if="data.left.blocks.length"
      :class="$style.twoColumnsColumn"
      :content="asEditorContentData(data.left)"
    />
    <div
      v-else
      :class="$style.twoColumnsColumn"
    />
    <EditorContentRenderer
      v-if="data.right.blocks.length"
      :class="$style.twoColumnsColumn"
      :content="asEditorContentData(data.right)"
    />
    <div
      v-else
      :class="$style.twoColumnsColumn"
    />
  </section>
</template>

<style module lang="scss" src="./EditorTwoColumnsBlock.module.scss" />
