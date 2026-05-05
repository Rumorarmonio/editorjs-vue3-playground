<script setup lang="ts">
import EditorDelimiterBlock from '~~/editor/renderer/components/blocks/EditorDelimiterBlock/EditorDelimiterBlock.vue'
import EditorEmbedBlock from '~~/editor/renderer/components/blocks/EditorEmbedBlock/EditorEmbedBlock.vue'
import EditorHeadingBlock from '~~/editor/renderer/components/blocks/EditorHeadingBlock/EditorHeadingBlock.vue'
import EditorImageBlock from '~~/editor/renderer/components/blocks/EditorImageBlock/EditorImageBlock.vue'
import EditorContentList from '~~/editor/renderer/components/blocks/EditorContentList/EditorContentList.vue'
import EditorMaskedFieldsDemoBlock from '~~/editor/renderer/components/blocks/EditorMaskedFieldsDemoBlock/EditorMaskedFieldsDemoBlock.vue'
import EditorMediaGalleryBlock from '~~/editor/renderer/components/blocks/EditorMediaGalleryBlock/EditorMediaGalleryBlock.vue'
import EditorNoticeBlock from '~~/editor/renderer/components/blocks/EditorNoticeBlock/EditorNoticeBlock.vue'
import EditorParagraphBlock from '~~/editor/renderer/components/blocks/EditorParagraphBlock/EditorParagraphBlock.vue'
import EditorQuoteBlock from '~~/editor/renderer/components/blocks/EditorQuoteBlock/EditorQuoteBlock.vue'
import EditorSectionIntroBlock from '~~/editor/renderer/components/blocks/EditorSectionIntroBlock/EditorSectionIntroBlock.vue'
import EditorTableBlock from '~~/editor/renderer/components/blocks/EditorTableBlock/EditorTableBlock.vue'
import EditorTwoColumnsBlock from '~~/editor/renderer/components/blocks/EditorTwoColumnsBlock/EditorTwoColumnsBlock.vue'
import EditorUnsupportedBlock from '~~/editor/renderer/components/blocks/EditorUnsupportedBlock/EditorUnsupportedBlock.vue'
import type { EditorContentBlock } from '~~/editor/shared'
import {
  normalizeMaskedFieldsDemoBlockData,
  normalizeMediaGalleryBlockData,
  normalizeNoticeBlockData,
  normalizeSectionIntroBlockData,
  normalizeTwoColumnsBlockData,
} from '~~/editor/shared'

defineProps<{
  block: EditorContentBlock
  fallbackBlockId: string
  variant: 'default' | 'sectionIntro'
}>()
</script>

<template>
  <EditorHeadingBlock
    v-if="block.type === 'header'"
    :block="block"
  />
  <EditorParagraphBlock
    v-else-if="block.type === 'paragraph'"
    :block="block"
    :variant="variant"
  />
  <EditorContentList
    v-else-if="block.type === 'list'"
    :items="block.data.items"
    :style="block.data.style"
  />
  <EditorQuoteBlock
    v-else-if="block.type === 'quote'"
    :block="block"
  />
  <EditorDelimiterBlock v-else-if="block.type === 'delimiter'" />
  <EditorTableBlock
    v-else-if="block.type === 'table'"
    :block="block"
  />
  <EditorEmbedBlock
    v-else-if="block.type === 'embed'"
    :block="block"
  />
  <EditorImageBlock
    v-else-if="block.type === 'image'"
    :block="block"
  />
  <EditorNoticeBlock
    v-else-if="block.type === 'notice'"
    :data="normalizeNoticeBlockData(block.data)"
  />
  <EditorSectionIntroBlock
    v-else-if="block.type === 'sectionIntro'"
    :data="normalizeSectionIntroBlockData(block.data)"
  />
  <EditorTwoColumnsBlock
    v-else-if="block.type === 'twoColumns'"
    :data="normalizeTwoColumnsBlockData(block.data)"
  />
  <EditorMediaGalleryBlock
    v-else-if="block.type === 'mediaGallery'"
    :data="normalizeMediaGalleryBlockData(block.data)"
    :fallback-gallery-id="`media-gallery-${fallbackBlockId}`"
  />
  <EditorMaskedFieldsDemoBlock
    v-else-if="block.type === 'maskedFieldsDemo'"
    :data="normalizeMaskedFieldsDemoBlockData(block.data)"
  />
  <EditorUnsupportedBlock
    v-else
    :block="block"
  />
</template>
