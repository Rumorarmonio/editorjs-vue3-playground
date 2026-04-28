<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditorJsEditor from '~~/editor/admin/components/EditorJsEditor/EditorJsEditor.vue'
import type { EditorContentData } from '~~/editor/shared'

const {
  importDraftJson,
  isReady,
  loadContent,
  resolvedContent,
  saveDraft,
  sourceLabel,
} = useEditorContentSource()

const saveMessage = ref<string | null>(null)
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const hasUnsavedChanges = ref(false)
const editorRenderKey = ref(0)
const editorRef = ref<InstanceType<typeof EditorJsEditor> | null>(null)
const importFileInputRef = ref<HTMLInputElement | null>(null)

async function handleSaveDraft(): Promise<void> {
  saveMessage.value = null
  await editorRef.value?.save()
}

async function handleOpenPreview(): Promise<void> {
  saveMessage.value = null

  if (await editorRef.value?.save({ validateContent: false })) {
    await navigateTo('/preview')
  }
}

function handleSaved(content: EditorContentData): void {
  saveDraft(content)
  hasUnsavedChanges.value = false
  saveMessage.value = 'Draft saved locally.'
}

function handleChanged(): void {
  hasUnsavedChanges.value = true
  saveMessage.value = null
}

function handleImportJson(serializedContent: string): boolean {
  if (
    hasUnsavedChanges.value &&
    !window.confirm('Import JSON and discard unsaved editor changes?')
  ) {
    return false
  }

  const error = importDraftJson(serializedContent)

  importMessage.value = null
  importError.value = error

  if (error) {
    return false
  }

  importJsonText.value = ''
  saveMessage.value = null
  hasUnsavedChanges.value = false
  importMessage.value = 'JSON imported to local draft.'
  editorRenderKey.value += 1

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
        <p :class="$style.kicker">Editor shell</p>
        <h1 :class="$style.title">Content draft</h1>
      </div>

      <button
        :class="$style.previewLink"
        type="button"
        @click="handleOpenPreview"
      >
        Open preview
      </button>
    </section>

    <section :class="$style.workspace">
      <aside :class="$style.sidebar">
        <dl :class="$style.metaList">
          <div :class="$style.metaItem">
            <dt>Source</dt>
            <dd>{{ sourceLabel }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>Blocks</dt>
            <dd>{{ resolvedContent.data.blocks.length }}</dd>
          </div>
          <div :class="$style.metaItem">
            <dt>Status</dt>
            <dd>{{ isReady ? 'Loaded' : 'Loading' }}</dd>
          </div>
        </dl>
      </aside>

      <section
        :class="$style.editorPanel"
      >
        <EditorJsEditor
          v-if="isReady"
          :key="editorRenderKey"
          ref="editorRef"
          :initial-data="resolvedContent.data"
          @changed="handleChanged"
          @saved="handleSaved"
        />

        <div :class="$style.actions">
          <button
            :class="$style.primaryButton"
            type="button"
            @click="handleSaveDraft"
          >
            Save draft
          </button>

          <p
            v-if="saveMessage"
            :class="$style.success"
          >
            {{ saveMessage }}
          </p>
        </div>

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
              @click="handleChooseJsonFile"
            >
              Choose file
            </button>
          </div>

          <textarea
            v-model="importJsonText"
            :class="$style.importTextarea"
            rows="7"
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
              :disabled="importJsonText.trim().length === 0"
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
      </section>
    </section>
  </main>
</template>

<style module lang="scss" src="./index.module.scss" />
