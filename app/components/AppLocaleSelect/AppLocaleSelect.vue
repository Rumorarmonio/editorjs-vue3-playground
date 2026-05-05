<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isLocalePreference, type AppLocalePreference } from '~~/i18n'

defineProps<{
  id: string
  modelValue: AppLocalePreference
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AppLocalePreference]
}>()

const { t } = useI18n()
const { supportedLocales } = useAppLocale()

function handleChange(event: Event): void {
  const nextPreference = (event.target as HTMLSelectElement).value

  if (!isLocalePreference(nextPreference)) {
    return
  }

  emit('update:modelValue', nextPreference)
}
</script>

<template>
  <div :class="$style.control">
    <label
      :class="$style.label"
      :for="id"
    >
      {{ t('app.locale.label') }}
    </label>

    <select
      :id="id"
      :class="$style.select"
      :value="modelValue"
      @change="handleChange"
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
</template>

<style module lang="scss" src="./AppLocaleSelect.module.scss" />
