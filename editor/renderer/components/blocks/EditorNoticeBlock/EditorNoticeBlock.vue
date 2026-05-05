<script setup lang="ts">
import type { NoticeBlockData } from '~~/editor/shared'

defineProps<{
  data: NoticeBlockData
}>()
</script>

<template>
  <aside :class="[$style.notice, $style[`notice_${data.type}`]]">
    <p
      v-if="data.title"
      :class="$style.noticeTitle"
    >
      {{ data.title }}
    </p>
    <p
      v-if="data.text"
      :class="$style.noticeText"
    >
      {{ data.text }}
    </p>
  </aside>
</template>

<style module lang="scss" src="./EditorNoticeBlock.module.scss" />
