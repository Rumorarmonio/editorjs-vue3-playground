<script setup lang="ts">
import {
  getInlineText,
  sanitizeInlineHtml,
} from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'
import {
  getAllowedEmbedIframeUrl,
  getKnownBlockTuneData,
} from '~~/editor/shared'

const props = defineProps<{
  block: EditorBlock<'embed'>
}>()

const nativeFancyboxVideoServices = new Set(['youtube', 'vimeo'])

function shouldOpenEmbedInFancybox(): boolean {
  return (
    getKnownBlockTuneData(props.block.tunes).embedDisplay?.mode ===
      'fancybox' && Boolean(getAllowedEmbedIframeUrl(props.block.data))
  )
}

function getEmbedFancyboxCaption(): string {
  return getInlineText(props.block.data.caption || props.block.data.source)
}

function isNativeFancyboxVideo(): boolean {
  return nativeFancyboxVideoServices.has(props.block.data.service)
}

function getEmbedFancyboxUrl(): string {
  return isNativeFancyboxVideo()
    ? props.block.data.source
    : (getAllowedEmbedIframeUrl(props.block.data) ?? props.block.data.source)
}

function getEmbedFancyboxType(): string | undefined {
  return isNativeFancyboxVideo() ? undefined : 'iframe'
}
</script>

<template>
  <figure :class="$style.embed">
    <div
      v-if="shouldOpenEmbedInFancybox()"
      :class="$style.embedFancyboxPreview"
    >
      <iframe
        :height="block.data.height ?? 320"
        :src="getAllowedEmbedIframeUrl(block.data) ?? ''"
        :title="getInlineText(block.data.caption || block.data.source)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        tabindex="-1"
      />
      <a
        :aria-label="getEmbedFancyboxCaption()"
        :class="$style.embedFancyboxOverlay"
        :data-caption="getEmbedFancyboxCaption()"
        data-aspect-ratio="16 / 9"
        data-editor-embed-fancybox
        data-fancybox="editor-embeds"
        data-height="810"
        :data-type="getEmbedFancyboxType()"
        data-width="1440"
        :href="getEmbedFancyboxUrl()"
      />
    </div>
    <iframe
      v-else-if="getAllowedEmbedIframeUrl(block.data)"
      :height="block.data.height ?? 320"
      :src="getAllowedEmbedIframeUrl(block.data) ?? ''"
      :title="getInlineText(block.data.caption || block.data.source)"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <a
      v-else
      :href="block.data.source"
      rel="noreferrer"
      target="_blank"
    >
      {{ block.data.service || block.data.source }}
    </a>
    <figcaption
      v-if="block.data.caption"
      v-html="sanitizeInlineHtml(block.data.caption)"
    />
  </figure>
</template>

<style module lang="scss" src="./EditorEmbedBlock.module.scss" />
