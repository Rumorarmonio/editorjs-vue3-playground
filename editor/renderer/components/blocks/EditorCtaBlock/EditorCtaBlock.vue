<script setup lang="ts">
import { useCssModule } from 'vue'
import type { CtaBlockData, CtaBlockVariant } from '~~/editor/shared'

const props = defineProps<{
  data: CtaBlockData
}>()

const runtimeConfig = useRuntimeConfig()
const style = useCssModule()

const href = computed(() => {
  return resolveCtaHref(props.data.url, runtimeConfig.app.baseURL)
})

const isInternalAppLink = computed(() => {
  return (
    props.data.actionType === 'link' &&
    props.data.target === 'sameTab' &&
    isRootRelativeAppUrl(props.data.url)
  )
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
        payload: parseEventPayload(props.data.eventPayloadJson),
        data: props.data,
      },
    }),
  )
}

function getCtaVariantClass(variant: CtaBlockVariant): string {
  switch (variant) {
    case 'secondary':
      return style.ctaActionSecondary ?? ''
    case 'ghost':
      return style.ctaActionGhost ?? ''
    default:
      return style.ctaActionPrimary ?? ''
  }
}

function resolveCtaHref(url: string, baseURL: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return url
  }

  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return `${normalizedBaseURL}${url}`
}

function isRootRelativeAppUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//')
}

function parseEventPayload(value: string): Record<string, unknown> | undefined {
  if (!value.trim()) {
    return undefined
  }

  try {
    const parsed: unknown = JSON.parse(value)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>
    }
  } catch {
    return undefined
  }

  return undefined
}
</script>

<template>
  <NuxtLink
    v-if="isInternalAppLink"
    :class="[$style.ctaAction, getCtaVariantClass(data.variant)]"
    :to="data.url"
  >
    {{ data.label }}
  </NuxtLink>
  <a
    v-else-if="data.actionType === 'link'"
    :class="[$style.ctaAction, getCtaVariantClass(data.variant)]"
    :href="href"
    :target="target"
    :rel="rel"
  >
    {{ data.label }}
  </a>
  <button
    v-else
    type="button"
    :class="[$style.ctaAction, getCtaVariantClass(data.variant)]"
    @click="handleEventAction"
  >
    {{ data.label }}
  </button>
</template>

<style module lang="scss" src="./EditorCtaBlock.module.scss" />
