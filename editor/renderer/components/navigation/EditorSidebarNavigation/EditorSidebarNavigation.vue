<script setup lang="ts">
import type { NavigationItem } from '~~/editor/shared'

defineOptions({
  name: 'EditorSidebarNavigation',
})

defineProps<{
  items: NavigationItem[]
}>()
</script>

<template>
  <nav
    v-if="items.length > 0"
    :class="$style.navigation"
    aria-label="Content navigation"
  >
    <p :class="$style.title">On this page</p>
    <ol :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <a
          :class="$style.link"
          :href="`#${item.anchor}`"
        >
          {{ item.title }}
        </a>
      </li>
    </ol>
  </nav>
</template>

<style
  module
  lang="scss"
  src="./EditorSidebarNavigation.module.scss"
/>
