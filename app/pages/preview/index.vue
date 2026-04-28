<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import EditorSidebarNavigation from '~~/editor/renderer/components/navigation/EditorSidebarNavigation/EditorSidebarNavigation.vue'
import {
  buildFlatNavigationItems,
  getValidationSummary,
  validateEditorContentData,
} from '~~/editor/shared'

const {
  importDraftJson,
  isReady,
  loadContent,
  resetDraft,
  resolvedContent,
  sourceLabel,
} = useEditorContentSource()

const exportFileName = 'editor-content.json'
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const exportError = ref<string | null>(null)
const importFileInputRef = ref<HTMLInputElement | null>(null)
const navigationItems = computed(() => {
  return buildFlatNavigationItems(resolvedContent.value.data)
})

function handleExportJson(): void {
  if (!import.meta.client) {
    return
  }

  const validationSummary = getValidationSummary(
    validateEditorContentData(resolvedContent.value.data),
  )

  exportError.value = validationSummary

  if (validationSummary) {
    return
  }

  const serializedContent = JSON.stringify(resolvedContent.value.data, null, 2)
  const blob = new Blob([serializedContent], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = exportFileName
  link.click()
  URL.revokeObjectURL(url)
}

function handleResetDraft(): void {
  resetDraft()
  importMessage.value = null
  importError.value = null
  exportError.value = null
}

function handleImportJson(serializedContent: string): boolean {
  const error = importDraftJson(serializedContent)

  importMessage.value = null
  importError.value = error

  if (error) {
    return false
  }

  importJsonText.value = ''
  exportError.value = null
  importMessage.value = 'JSON imported to local draft.'

  return true
}

function handleImportPastedJson(): void {
  handleImportJson(importJsonText.value)
}

function handleChooseJsonFile(): void {
  importFileInputRef.value?.click()
}

async function handleImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    handleImportJson(await file.text())
  } catch {
    importMessage.value = null
    importError.value = 'JSON file could not be read.'
  } finally {
    input.value = ''
  }
}

onMounted(loadContent)
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">Preview shell</p>
        <h1 :class="$style.title">Rendered content</h1>
        <p :class="$style.meta">
          {{ isReady ? sourceLabel : 'Loading' }}
        </p>
      </div>

      <div :class="$style.actions">
        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleExportJson"
        >
          Export JSON
        </button>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          Reset draft
        </button>

        <NuxtLink
          :class="$style.editorLink"
          to="/"
        >
          Back to editor
        </NuxtLink>

        <p
          v-if="exportError"
          :class="$style.error"
          role="alert"
        >
          {{ exportError }}
        </p>
      </div>
    </section>

    <section :class="$style.previewLayout">
      <aside
        v-if="navigationItems.length > 0"
        :class="$style.sidebar"
      >
        <EditorSidebarNavigation :items="navigationItems" />
      </aside>

      <div :class="$style.previewPanel">
        <EditorContentRenderer :content="resolvedContent.data" />
      </div>
    </section>

    <section
      :class="$style.importPanel"
      aria-labelledby="import-json-title"
    >
      <div :class="$style.importHeader">
        <h2
          id="import-json-title"
          :class="$style.importTitle"
        >
          Import JSON
        </h2>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleChooseJsonFile"
        >
          Choose file
        </button>
      </div>

      <textarea
        v-model="importJsonText"
        :class="$style.importTextarea"
        rows="5"
        spellcheck="false"
        placeholder="Paste EditorContentData JSON"
      />

      <input
        ref="importFileInputRef"
        :class="$style.fileInput"
        type="file"
        accept="application/json,.json"
        @change="handleImportFile"
      >

      <div :class="$style.importActions">
        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || importJsonText.trim().length === 0"
          @click="handleImportPastedJson"
        >
          Import pasted JSON
        </button>

        <p
          v-if="importMessage"
          :class="$style.success"
        >
          {{ importMessage }}
        </p>

        <p
          v-if="importError"
          :class="$style.error"
          role="alert"
        >
          {{ importError }}
        </p>
      </div>
    </section>
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
