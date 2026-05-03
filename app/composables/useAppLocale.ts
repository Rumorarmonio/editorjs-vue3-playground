import { computed, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  defaultLocale,
  defaultLocalePreference,
  getEditorMessages,
  isLocalePreference,
  isSupportedLocale,
  setCurrentEditorMessages,
  supportedLocales,
  type AppLocalePreference,
  type SupportedLocale,
} from '~~/i18n/editor'

export const localeStorageKey = 'editorjs-vue3-locale'
let isLocaleRuntimeInitialized = false

const russianLanguageCodes = new Set([
  'ru',
  'uk',
  'be',
  'kk',
  'ky',
  'uz',
  'tg',
  'tk',
  'hy',
  'az',
  'ka',
  'mo',
])

const russianRegionCodes = new Set([
  'RU',
  'UA',
  'BY',
  'KZ',
  'KG',
  'UZ',
  'TJ',
  'TM',
  'AM',
  'AZ',
  'GE',
  'MD',
])

const spanishLanguageCodes = new Set([
  'es',
  'ca',
  'eu',
  'gl',
  'ast',
  'an',
  'oc',
])

const spanishRegionCodes = new Set(['ES'])

function getStoredLocalePreference(): AppLocalePreference {
  if (!import.meta.client) {
    return defaultLocalePreference
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey)

  return isLocalePreference(storedLocale) ? storedLocale : defaultLocalePreference
}

function normalizeLanguageTag(value: string): {
  language: string
  region: string | null
} {
  const [language = '', ...subtags] = value.replace(/_/g, '-').split('-')
  const region = subtags.find((subtag) => subtag.length === 2) ?? null

  return {
    language: language.toLowerCase(),
    region: region === null ? null : region.toUpperCase(),
  }
}

export function resolveLocaleFromLanguageTags(
  languageTags: ReadonlyArray<string>,
): SupportedLocale {
  for (const languageTag of languageTags) {
    const { language, region } = normalizeLanguageTag(languageTag)

    if (isSupportedLocale(language)) {
      return language
    }

    if (
      russianLanguageCodes.has(language) ||
      (region !== null && russianRegionCodes.has(region))
    ) {
      return 'ru'
    }

    if (
      spanishLanguageCodes.has(language) ||
      (region !== null && spanishRegionCodes.has(region))
    ) {
      return 'es'
    }
  }

  return defaultLocale
}

export function getSystemLocale(): SupportedLocale {
  if (!import.meta.client) {
    return defaultLocale
  }

  const languageTags =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language]

  return resolveLocaleFromLanguageTags(languageTags)
}

function resolveLocale(
  localePreference: AppLocalePreference,
  systemLocale: SupportedLocale,
): SupportedLocale {
  return localePreference === 'system' ? systemLocale : localePreference
}

function initializeLocaleRuntime(
  localePreference: Ref<AppLocalePreference>,
  systemLocale: Ref<SupportedLocale>,
  vueI18nLocale: Ref<string>,
): void {
  if (!import.meta.client || isLocaleRuntimeInitialized) {
    return
  }

  isLocaleRuntimeInitialized = true
  localePreference.value = getStoredLocalePreference()
  systemLocale.value = getSystemLocale()

  watch(
    [localePreference, systemLocale],
    ([nextPreference, nextSystemLocale]) => {
      const nextLocale = resolveLocale(nextPreference, nextSystemLocale)

      vueI18nLocale.value = nextLocale
      setCurrentEditorMessages(getEditorMessages(nextLocale))
      document.documentElement.lang = nextLocale
      document.documentElement.dataset.locale = nextLocale
      document.documentElement.dataset.localePreference = nextPreference
    },
    { immediate: true },
  )
}

export function useAppLocale() {
  const { locale } = useI18n()
  const localePreference = useState<AppLocalePreference>(
    'app-locale-preference',
    getStoredLocalePreference,
  )
  const systemLocale = useState<SupportedLocale>(
    'app-system-locale',
    getSystemLocale,
  )

  const currentLocale = computed<SupportedLocale>(() =>
    resolveLocale(localePreference.value, systemLocale.value),
  )
  const currentLocalePreference = computed(() => localePreference.value)
  const editorMessages = computed(() => getEditorMessages(currentLocale.value))

  setCurrentEditorMessages(editorMessages.value)

  function setLocalePreference(nextValue: AppLocalePreference): void {
    localePreference.value = nextValue
    locale.value = resolveLocale(nextValue, systemLocale.value)
    setCurrentEditorMessages(getEditorMessages(currentLocale.value))

    if (import.meta.client) {
      window.localStorage.setItem(localeStorageKey, nextValue)
    }
  }

  initializeLocaleRuntime(localePreference, systemLocale, locale)

  return {
    currentLocale,
    currentLocalePreference,
    editorMessages,
    setLocalePreference,
    supportedLocales,
  }
}
