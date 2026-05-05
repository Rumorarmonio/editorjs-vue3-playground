<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorContentRenderer from '~~/editor/renderer/components/EditorContentRenderer/EditorContentRenderer.vue'
import EditorSidebarNavigation from '~~/editor/renderer/components/EditorSidebarNavigation/EditorSidebarNavigation.vue'
import {
  buildFlatNavigationItems,
  buildHeadingNavigationItems,
  getValidationSummary,
  validateEditorContentData,
} from '~~/editor/shared'

const { t } = useI18n()
const { currentLocalePreference, setLocalePreference } = useAppLocale()
const { currentTheme, setTheme } = useAppTheme()

const {
  importDraftJson,
  isReady,
  loadContent,
  resetDraft,
  resolvedContent,
} = useEditorContentSource()

const exportFileName = 'editor-content.json'
const importJsonText = ref('')
const importMessage = ref<string | null>(null)
const importError = ref<string | null>(null)
const exportError = ref<string | null>(null)
const navigationMode = ref<'labels' | 'headings'>('headings')
const headingNavigationItems = computed(() =>
  buildHeadingNavigationItems(resolvedContent.value.data),
)
const labelNavigationItems = computed(() =>
  buildFlatNavigationItems(resolvedContent.value.data),
)
const navigationItems = computed(() => {
  return navigationMode.value === 'headings'
    ? headingNavigationItems.value
    : labelNavigationItems.value
})
const hasNavigationItems = computed(() => {
  return (
    headingNavigationItems.value.length > 0 ||
    labelNavigationItems.value.length > 0
  )
})
const translatedSourceLabel = computed(() =>
  resolvedContent.value.source === 'draft'
    ? t('app.common.localDraft')
    : t('app.common.defaultJson'),
)

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
  const error = importDraftJson(serializedContent, {
    browserOnlyError: t('app.common.importBrowserOnly'),
    parseError: t('app.common.importParseError'),
    schemaError: t('app.common.importSchemaError'),
  })

  importMessage.value = null
  importError.value = error

  if (error) {
    return false
  }

  importJsonText.value = ''
  exportError.value = null
  importMessage.value = t('app.common.importSuccess')

  return true
}

function handleImportPastedJson(): void {
  handleImportJson(importJsonText.value)
}

async function handleImportFile(file: File): Promise<void> {
  try {
    handleImportJson(await file.text())
  } catch {
    importMessage.value = null
    importError.value = t('app.common.importReadError')
  }
}

function handleSetLocalePreference(
  nextPreference: Parameters<typeof setLocalePreference>[0],
): void {
  setLocalePreference(nextPreference)
  exportError.value = null
}

function handleSetNavigationMode(event: Event): void {
  const nextMode = (event.target as HTMLSelectElement).value

  if (nextMode !== 'labels' && nextMode !== 'headings') {
    return
  }

  navigationMode.value = nextMode
}

onMounted(loadContent)
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.header">
      <div :class="$style.heading">
        <p :class="$style.kicker">{{ t('app.previewPage.kicker') }}</p>
        <h1 :class="$style.title">{{ t('app.previewPage.title') }}</h1>
        <p :class="$style.meta">
          {{
            isReady ? translatedSourceLabel : t('app.common.loading')
          }}
        </p>
      </div>

      <div
        :class="$style.actions"
        @keydown.stop
      >
        <AppLocaleSelect
          id="preview-locale-select"
          :model-value="currentLocalePreference"
          @update:model-value="handleSetLocalePreference"
        />

        <AppThemeSelect
          id="preview-theme-select"
          :model-value="currentTheme"
          @update:model-value="setTheme"
        />

        <AppButton
          :disabled="!isReady"
          @click="handleExportJson"
        >
          {{ t('app.previewPage.exportJson') }}
        </AppButton>

        <AppButton
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          {{ t('app.previewPage.resetDraft') }}
        </AppButton>

        <NuxtLink
          :class="$style.editorLink"
          to="/"
        >
          {{ t('app.previewPage.backToEditor') }}
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
        v-if="hasNavigationItems"
        :class="$style.sidebar"
      >
        <div :class="$style.navigationControl">
          <label
            :class="$style.controlLabel"
            for="preview-navigation-mode-select"
          >
            {{ t('app.navigation.label') }}
          </label>

          <select
            id="preview-navigation-mode-select"
            :class="$style.controlSelect"
            :value="navigationMode"
            @change="handleSetNavigationMode"
          >
            <option value="headings">
              {{ t('app.navigation.headings') }}
            </option>
            <option value="labels">
              {{ t('app.navigation.labels') }}
            </option>
          </select>
        </div>

        <EditorSidebarNavigation
          v-if="navigationItems.length > 0"
          :items="navigationItems"
          :title="t('app.navigation.title')"
        />
      </aside>

      <div :class="$style.previewPanel">
        <EditorContentRenderer :content="resolvedContent.data" />
      </div>
    </section>

    <ImportJsonPanel
      id="preview-import-json"
      v-model="importJsonText"
      :disabled="!isReady"
      :error="importError"
      :message="importMessage"
      @import-file="handleImportFile"
      @import-pasted="handleImportPastedJson"
    />
  </main>
</template>

<style module lang="scss" src="./preview.module.scss" />
