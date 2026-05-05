<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { AppTheme } from '~~/app/composables/useAppTheme'

defineProps<{
  id: string
  modelValue: AppTheme
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AppTheme]
}>()

const { t } = useI18n()
const { appThemeOptions } = useAppTheme()

function handleChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value as AppTheme)
}
</script>

<template>
  <div :class="$style.control">
    <label
      :class="$style.label"
      :for="id"
    >
      {{ t('app.theme.label') }}
    </label>

    <select
      :id="id"
      :class="$style.select"
      :value="modelValue"
      @change="handleChange"
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
</template>

<style module lang="scss" src="./AppThemeSelect.module.scss" />
