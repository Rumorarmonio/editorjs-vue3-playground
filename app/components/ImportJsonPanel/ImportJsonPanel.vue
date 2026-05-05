<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    id: string
    modelValue: string
    rows?: number
    disabled?: boolean
    message?: string | null
    error?: string | null
    variant?: 'inline' | 'card'
  }>(),
  {
    disabled: false,
    error: null,
    message: null,
    rows: 5,
    variant: 'card',
  },
)

const emit = defineEmits<{
  'import-file': [file: File]
  'import-pasted': []
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

const titleId = `${props.id}-title`

function handleChooseJsonFile(): void {
  fileInputRef.value?.click()
}

function handleTextInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function handleImportFile(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    emit('import-file', file)
  }

  input.value = ''
}
</script>

<template>
  <section
    :aria-labelledby="titleId"
    :class="[$style.panel, $style[`panel_${variant}`]]"
  >
    <div :class="$style.header">
      <h2
        :id="titleId"
        :class="$style.title"
      >
        {{ t('app.common.importJson') }}
      </h2>

      <AppButton
        :disabled="disabled"
        @click="handleChooseJsonFile"
      >
        {{ t('app.common.chooseFile') }}
      </AppButton>
    </div>

    <textarea
      :class="$style.textarea"
      :placeholder="t('app.common.importPlaceholder')"
      :rows="rows"
      spellcheck="false"
      :value="modelValue"
      @input="handleTextInput"
    />

    <input
      ref="fileInputRef"
      :class="$style.fileInput"
      type="file"
      accept="application/json,.json"
      @change="handleImportFile"
    >

    <div :class="$style.actions">
      <AppButton
        :disabled="disabled || modelValue.trim().length === 0"
        @click="emit('import-pasted')"
      >
        {{ t('app.common.importPastedJson') }}
      </AppButton>

      <p
        v-if="message"
        :class="$style.success"
      >
        {{ message }}
      </p>

      <p
        v-if="error"
        :class="$style.error"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
  </section>
</template>

<style module lang="scss" src="./ImportJsonPanel.module.scss" />
