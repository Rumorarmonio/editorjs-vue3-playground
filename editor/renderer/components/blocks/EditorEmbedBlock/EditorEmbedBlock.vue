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

function shouldOpenEmbedInFancybox(): boolean {
  return (
    getKnownBlockTuneData(props.block.tunes).embedDisplay?.mode ===
      'fancybox' && Boolean(getAllowedEmbedIframeUrl(props.block.data))
  )
}

function getEmbedFancyboxCaption(): string {
  return getInlineText(props.block.data.caption || props.block.data.source)
}

function getEmbedFancyboxUrl(): string {
  const embedUrl = getAllowedEmbedIframeUrl(props.block.data)

  return embedUrl ? getAutoplayEmbedUrl(embedUrl) : props.block.data.source
}

function getAutoplayEmbedUrl(value: string): string {
  try {
    const url = new URL(value.replaceAll('&amp;', '&'))

    if (isYoutubeEmbedUrl(url) || isVimeoEmbedUrl(url)) {
      url.searchParams.set('autoplay', '1')
    }

    return url.toString()
  } catch {
    return value
  }
}

function isYoutubeEmbedUrl(url: URL): boolean {
  return (
    url.hostname === 'www.youtube.com' &&
    /^\/embed\/[a-zA-Z0-9_-]{11}$/.test(url.pathname)
  )
}

function isVimeoEmbedUrl(url: URL): boolean {
  return (
    url.hostname === 'player.vimeo.com' && /^\/video\/\d+$/.test(url.pathname)
  )
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
        data-type="iframe"
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
