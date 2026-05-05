<script setup lang="ts">
import { sanitizeInlineHtml } from '~~/editor/renderer/helpers/sanitize-inline-html'
import type { EditorBlock } from '~~/editor/shared'

defineProps<{
  block: EditorBlock<'table'>
}>()
</script>

<template>
  <div :class="$style.tableWrap">
    <table :class="$style.table">
      <tbody>
        <tr
          v-for="(row, rowIndex) in block.data.content"
          :key="rowIndex"
        >
          <component
            :is="block.data.withHeadings && rowIndex === 0 ? 'th' : 'td'"
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
          >
            <span v-html="sanitizeInlineHtml(cell)" />
          </component>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module lang="scss" src="./EditorTableBlock.module.scss" />
