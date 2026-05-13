<script setup lang="ts">
import type { CtaBlockData } from '~~/editor/shared'

const props = defineProps<{
  data: CtaBlockData
}>()

const runtimeConfig = useRuntimeConfig()

const href = computed(() => {
  return resolveCtaHref(props.data.url, runtimeConfig.app.baseURL)
})

const target = computed(() => {
  return props.data.target === 'newTab' ? '_blank' : undefined
})

const rel = computed(() => {
  return props.data.target === 'newTab' ? 'noreferrer' : undefined
})

function handleEventAction(): void {
  const eventName = props.data.eventName

  window.dispatchEvent(
    new CustomEvent('editor:cta-action', {
      detail: {
        eventName,
        data: props.data,
      },
    }),
  )
}

function resolveCtaHref(url: string, baseURL: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return url
  }

  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return `${normalizedBaseURL}${url}`
}
</script>

<template>
  <aside :class="[$style.cta, $style[`cta_${data.variant}`]]">
    <p
      v-if="data.description"
      :class="$style.ctaDescription"
    >
      {{ data.description }}
    </p>
    <a
      v-if="data.actionType === 'link'"
      :class="$style.ctaAction"
      :href="href"
      :target="target"
      :rel="rel"
    >
      {{ data.label }}
    </a>
    <button
      v-else
      type="button"
      :class="$style.ctaAction"
      @click="handleEventAction"
    >
      {{ data.label }}
    </button>
  </aside>
</template>

<style module lang="scss" src="./EditorCtaBlock.module.scss" />
