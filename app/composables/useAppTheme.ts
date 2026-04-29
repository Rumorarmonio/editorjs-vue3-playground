import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

export type AppTheme = 'system' | 'light' | 'dark'
type ResolvedAppTheme = 'light' | 'dark'

const themeStorageKey = 'editorjs-vue3-theme'
const defaultTheme: AppTheme = 'system'
const themeMediaQuery = '(prefers-color-scheme: dark)'

export const appThemeOptions = [
  'system',
  'light',
  'dark',
] as const satisfies ReadonlyArray<AppTheme>

function isAppTheme(value: unknown): value is AppTheme {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getSystemTheme(): ResolvedAppTheme {
  if (!import.meta.client) {
    return 'light'
  }

  return window.matchMedia(themeMediaQuery).matches ? 'dark' : 'light'
}

function resolveTheme(theme: AppTheme): ResolvedAppTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(theme: ResolvedAppTheme, preference: AppTheme): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.themePreference = preference
  document.documentElement.style.colorScheme = theme
}

export function useAppTheme() {
  const theme = useState<AppTheme>('app-theme', () => defaultTheme)
  const systemTheme = useState<ResolvedAppTheme>(
    'app-system-theme',
    () => 'light',
  )
  let removeSystemThemeListener: (() => void) | null = null
  const currentTheme = computed(() => theme.value)
  const resolvedTheme = computed<ResolvedAppTheme>(() =>
    theme.value === 'system' ? systemTheme.value : theme.value,
  )

  function setTheme(nextValue: AppTheme): void {
    theme.value = nextValue

    if (import.meta.client) {
      window.localStorage.setItem(themeStorageKey, nextValue)
    }
  }

  onMounted(() => {
    const mediaQueryList = window.matchMedia(themeMediaQuery)
    const updateSystemTheme = (): void => {
      systemTheme.value = mediaQueryList.matches ? 'dark' : 'light'
    }
    const storedTheme = window.localStorage.getItem(themeStorageKey)

    updateSystemTheme()

    if (isAppTheme(storedTheme)) {
      theme.value = storedTheme
    }

    mediaQueryList.addEventListener('change', updateSystemTheme)
    applyTheme(resolveTheme(theme.value), theme.value)

    removeSystemThemeListener = () => {
      mediaQueryList.removeEventListener('change', updateSystemTheme)
    }
  })

  onBeforeUnmount(() => {
    removeSystemThemeListener?.()
  })

  watch(
    [theme, systemTheme],
    ([nextTheme]) => {
      applyTheme(resolveTheme(nextTheme), nextTheme)
    },
    { immediate: import.meta.client },
  )

  return {
    appThemeOptions,
    currentTheme,
    resolvedTheme,
    setTheme,
  }
}
