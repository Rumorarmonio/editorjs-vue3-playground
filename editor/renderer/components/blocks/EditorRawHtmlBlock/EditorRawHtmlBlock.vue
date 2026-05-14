<script setup lang="ts">
import {
  cleanupRawHtml,
  renderRawHtml,
} from '~~/editor/renderer/helpers/sanitize-raw-html'
import type { RawHtmlBlockData } from '~~/editor/shared'

const props = defineProps<{
  data: RawHtmlBlockData
}>()

const runtimeConfig = useRuntimeConfig()
const rawHtmlElement = ref<HTMLElement | null>(null)

function syncRawHtml(): void {
  if (!rawHtmlElement.value) {
    return
  }

  renderRawHtml(rawHtmlElement.value, props.data.html, runtimeConfig.app.baseURL)
}

onMounted(syncRawHtml)

onBeforeUnmount(() => {
  if (rawHtmlElement.value) {
    cleanupRawHtml(rawHtmlElement.value)
  }
})

watch(
  () => props.data.html,
  () => {
    void nextTick(syncRawHtml)
  },
)
</script>

<template>
  <div
    ref="rawHtmlElement"
    :class="$style.rawHtml"
  />
</template>

<style module lang="scss" src="./EditorRawHtmlBlock.module.scss" />
