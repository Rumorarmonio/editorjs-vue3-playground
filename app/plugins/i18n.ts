import { createI18n } from 'vue-i18n'
import { getSystemLocale, localeStorageKey } from '~/composables/useAppLocale'
import {
  appMessages,
  defaultLocalePreference,
  isLocalePreference,
  type SupportedLocale,
} from '~~/i18n'

export default defineNuxtPlugin((nuxtApp) => {
  const storedLocalePreference = import.meta.client
    ? window.localStorage.getItem(localeStorageKey)
    : null
  const localePreference = isLocalePreference(storedLocalePreference)
    ? storedLocalePreference
    : defaultLocalePreference
  const locale: SupportedLocale =
    localePreference === 'system' ? getSystemLocale() : localePreference

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: appMessages,
  })

  nuxtApp.vueApp.use(i18n)
})
