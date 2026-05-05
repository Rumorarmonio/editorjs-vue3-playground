<script setup lang="ts">
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useCssModule,
  watch,
} from 'vue'
import EditorContentBlock from '~~/editor/renderer/components/blocks/EditorContentBlock/EditorContentBlock.vue'
import type {
  EditorContentBlock as EditorContentBlockData,
  EditorContentData,
} from '~~/editor/shared'
import {
  getBlockRenderedAnchorId,
  getKnownBlockTuneData,
} from '~~/editor/shared'

const props = defineProps<{
  content: EditorContentData
  variant?: 'default' | 'sectionIntro'
}>()

const style = useCssModule()
const rendererRef = ref<HTMLElement | null>(null)
let animationObserver: IntersectionObserver | null = null

const animatedBlockClass = style.animatedBlock ?? ''
const animationPreparedClass = style.animationPrepared ?? ''
const animationVisibleClass = style.animationVisible ?? ''
const embedFancyboxSelector = '[data-editor-embed-fancybox]'

const defaultBlockSpacing = '18px'
const spacingValueMap = {
  none: '0',
  small: '12px',
  medium: '24px',
  large: '40px',
} as const

function getBlockLabel(block: EditorContentBlockData): string | undefined {
  return getKnownBlockTuneData(block.tunes).label?.label
}

function getBlockAnimation(block: EditorContentBlockData): string | undefined {
  const animation = getKnownBlockTuneData(block.tunes).animation?.type

  return animation && animation !== 'none' ? animation : undefined
}

function getBlockClasses(block: EditorContentBlockData): string[] {
  const classes = style.block ? [style.block] : []

  if (getBlockAnimation(block) && animatedBlockClass && animationPreparedClass) {
    classes.push(animatedBlockClass)
    classes.push(animationPreparedClass)
  }

  return classes
}

function getBlockStyle(
  blocks: EditorContentBlockData[],
  block: EditorContentBlockData,
  index: number,
): Record<string, string> {
  if (index === 0) {
    return {}
  }

  const previousBlock = blocks[index - 1]
  const previousSpacing = previousBlock
    ? getKnownBlockTuneData(previousBlock.tunes).spacing
    : undefined
  const currentSpacing = getKnownBlockTuneData(block.tunes).spacing
  const spacing = currentSpacing?.top ?? previousSpacing?.bottom

  return {
    marginTop: spacing ? spacingValueMap[spacing] : defaultBlockSpacing,
  }
}

function setupAnimationObserver(): void {
  cleanupAnimationObserver()

  if (
    !import.meta.client ||
    !rendererRef.value ||
    !animationPreparedClass ||
    !animationVisibleClass
  ) {
    return
  }

  const blocks = Array.from(rendererRef.value.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      element.dataset.blockAnimation !== undefined,
  )

  if (blocks.length === 0) {
    return
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    blocks.forEach((block) => {
      block.classList.add(animationVisibleClass)
    })
    return
  }

  animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          return
        }

        entry.target.classList.add(animationVisibleClass)
        animationObserver?.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    },
  )

  blocks.forEach((block) => {
    animationObserver?.observe(block)
  })
}

function cleanupAnimationObserver(): void {
  animationObserver?.disconnect()
  animationObserver = null
}

function bindEmbedFancybox(): void {
  if (!import.meta.client || !rendererRef.value) {
    return
  }

  Fancybox.unbind(rendererRef.value, embedFancyboxSelector)
  Fancybox.bind(rendererRef.value, embedFancyboxSelector, {
    Hash: false,
    hideClass: 'editor-embed-fancybox-slide-out-up',
    mainStyle: {
      '--f-html-padding': '0',
      '--f-video-width': 'min(1440px, 96vw)',
      '--f-video-height': 'min(810px, 88vh)',
    },
    showClass: 'editor-embed-fancybox-slide-in-up',
    Carousel: {
      Video: {
        autoplay: true,
      },
    },
  })
}

function cleanupEmbedFancybox(): void {
  if (!import.meta.client || !rendererRef.value) {
    return
  }

  Fancybox.unbind(rendererRef.value, embedFancyboxSelector)
}

function refreshRendererEnhancements(): void {
  setupAnimationObserver()
  bindEmbedFancybox()
}

onMounted(() => {
  void nextTick(refreshRendererEnhancements)
})

watch(
  () => props.content,
  () => {
    void nextTick(refreshRendererEnhancements)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  cleanupAnimationObserver()
  cleanupEmbedFancybox()
})
</script>

<template>
  <article
    ref="rendererRef"
    :class="$style.renderer"
  >
    <template
      v-for="(block, index) in content.blocks"
      :key="block.id ?? `${block.type}-${index}`"
    >
      <div
        :id="getBlockRenderedAnchorId(content.blocks, block, index)"
        :class="getBlockClasses(block)"
        :data-block-animation="getBlockAnimation(block)"
        :data-block-label="getBlockLabel(block)"
        :style="getBlockStyle(content.blocks, block, index)"
      >
        <EditorContentBlock
          :block="block"
          :fallback-block-id="block.id ?? `${index}`"
          :variant="variant ?? 'default'"
        />
      </div>
    </template>
  </article>
</template>

<style module lang="scss" src="./EditorContentRenderer.module.scss" />
