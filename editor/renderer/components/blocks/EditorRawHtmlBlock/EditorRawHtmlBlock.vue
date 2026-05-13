<script setup lang="ts">
import { sanitizeRawHtml } from '~~/editor/renderer/helpers/sanitize-raw-html'
import type { RawHtmlBlockData } from '~~/editor/shared'

const props = defineProps<{
  data: RawHtmlBlockData
}>()

const runtimeConfig = useRuntimeConfig()
const sanitizedHtml = computed(() => {
  return sanitizeRawHtml(props.data.html, runtimeConfig.app.baseURL)
})
</script>

<template>
  <figure :class="$style.rawHtml">
    <div
      :class="$style.rawHtmlContent"
      v-html="sanitizedHtml"
    />
    <figcaption
      v-if="data.caption"
      :class="$style.rawHtmlCaption"
    >
      {{ data.caption }}
    </figcaption>
  </figure>
</template>

<style module lang="scss" src="./EditorRawHtmlBlock.module.scss" />
