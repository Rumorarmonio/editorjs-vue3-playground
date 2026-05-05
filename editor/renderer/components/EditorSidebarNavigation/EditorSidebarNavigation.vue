<script setup lang="ts">
import type { NavigationItem } from '~~/editor/shared'

defineOptions({
  name: 'EditorSidebarNavigation',
})

defineProps<{
  activeAnchor?: string | null
  items: NavigationItem[]
  isNested?: boolean
  title?: string
}>()
</script>

<template>
  <nav
    v-if="!isNested && items.length > 0"
    :class="$style.navigation"
    aria-label="Content navigation"
  >
    <p :class="$style.title">{{ title ?? 'On this page' }}</p>
    <ol :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <a
          :aria-current="activeAnchor === item.anchor ? 'location' : undefined"
          :class="[
            $style.link,
            activeAnchor === item.anchor ? $style.activeLink : undefined,
          ]"
          :href="`#${item.anchor}`"
        >
          {{ item.title }}
        </a>
        <EditorSidebarNavigation
          v-if="item.children?.length"
          :class="$style.nested"
          :active-anchor="activeAnchor"
          :items="item.children"
          is-nested
        />
      </li>
    </ol>
  </nav>

  <ol
    v-else-if="items.length > 0"
    :class="[$style.list, $style.nestedList]"
  >
    <li
      v-for="item in items"
      :key="item.id"
      :class="$style.item"
    >
      <a
        :aria-current="activeAnchor === item.anchor ? 'location' : undefined"
        :class="[
          $style.link,
          activeAnchor === item.anchor ? $style.activeLink : undefined,
        ]"
        :href="`#${item.anchor}`"
      >
        {{ item.title }}
      </a>
      <EditorSidebarNavigation
        v-if="item.children?.length"
        :class="$style.nested"
        :active-anchor="activeAnchor"
        :items="item.children"
        is-nested
      />
    </li>
  </ol>
</template>

<style
  module
  lang="scss"
  src="./EditorSidebarNavigation.module.scss"
/>
