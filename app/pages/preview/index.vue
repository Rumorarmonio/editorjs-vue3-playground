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
import { isLocalePreference } from '~~/i18n'

const { t } = useI18n()
const { currentLocalePreference, setLocalePreference, supportedLocales } =
  useAppLocale()
const { appThemeOptions, currentTheme, setTheme } = useAppTheme()

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
const importFileInputRef = ref<HTMLInputElement | null>(null)
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

function handleChooseJsonFile(): void {
  importFileInputRef.value?.click()
}

function handleSetTheme(event: Event): void {
  setTheme(
    (event.target as HTMLSelectElement).value as Parameters<typeof setTheme>[0],
  )
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
    importError.value = t('app.common.importReadError')
  } finally {
    input.value = ''
  }
}

function handleSetLocale(event: Event): void {
  const nextPreference = (event.target as HTMLSelectElement).value

  if (!isLocalePreference(nextPreference)) {
    return
  }

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
        <div :class="$style.localeControl">
          <label
            :class="$style.controlLabel"
            for="preview-locale-select"
          >
            {{ t('app.locale.label') }}
          </label>

          <select
            id="preview-locale-select"
            :class="$style.controlSelect"
            :value="currentLocalePreference"
            @change="handleSetLocale"
          >
            <option
              v-for="localeOption in supportedLocales"
              :key="localeOption.code"
              :value="localeOption.code"
            >
              {{ t(`app.locale.${localeOption.code}`) }}
            </option>
          </select>
        </div>

        <div
          :class="$style.themeControl"
        >
          <label
            :class="$style.controlLabel"
            for="preview-theme-select"
          >
            {{ t('app.theme.label') }}
          </label>

          <select
            id="preview-theme-select"
            :class="$style.controlSelect"
            :value="currentTheme"
            @change="handleSetTheme"
          >
            <option
              v-for="themeOption in appThemeOptions"
              :key="themeOption"
              :value="themeOption"
            >
              {{ t(`app.theme.${themeOption}`) }}
            </option>
          </select>
        </div>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleExportJson"
        >
          {{ t('app.previewPage.exportJson') }}
        </button>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady || resolvedContent.source !== 'draft'"
          @click="handleResetDraft"
        >
          {{ t('app.previewPage.resetDraft') }}
        </button>

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

    <section
      :class="$style.importPanel"
      aria-labelledby="import-json-title"
    >
      <div :class="$style.importHeader">
        <h2
          id="import-json-title"
          :class="$style.importTitle"
        >
          {{ t('app.common.importJson') }}
        </h2>

        <button
          :class="$style.secondaryButton"
          type="button"
          :disabled="!isReady"
          @click="handleChooseJsonFile"
        >
          {{ t('app.common.chooseFile') }}
        </button>
      </div>

      <textarea
        v-model="importJsonText"
        :class="$style.importTextarea"
        rows="5"
        spellcheck="false"
        :placeholder="t('app.common.importPlaceholder')"
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
          {{ t('app.common.importPastedJson') }}
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
