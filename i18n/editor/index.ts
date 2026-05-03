import { editorEn } from './en'
import { editorEs } from './es'
import { editorRu } from './ru'
import type {
  AppLocalePreference,
  EditorUiMessages,
  SupportedLocale,
} from './types'

export type {
  EditorUiMessages,
  EditorValidationMessages,
  AppLocalePreference,
  SupportedLocale,
} from './types'

export const defaultLocale: SupportedLocale = 'en'
export const defaultLocalePreference: AppLocalePreference = 'system'

export const supportedLocales = [
  {
    code: 'system',
    label: 'Auto',
  },
  {
    code: 'ru',
    label: 'RU',
  },
  {
    code: 'en',
    label: 'EN',
  },
  {
    code: 'es',
    label: 'ES',
  },
] as const satisfies ReadonlyArray<{
  code: AppLocalePreference
  label: string
}>

export const editorMessagesByLocale: Record<
  SupportedLocale,
  EditorUiMessages
> = {
  ru: editorRu,
  en: editorEn,
  es: editorEs,
}

let currentEditorMessages = editorMessagesByLocale[defaultLocale]

export function getEditorMessages(locale: SupportedLocale): EditorUiMessages {
  return editorMessagesByLocale[locale] ?? editorMessagesByLocale[defaultLocale]
}

export function setCurrentEditorMessages(messages: EditorUiMessages): void {
  currentEditorMessages = messages
}

export function getCurrentEditorMessages(): EditorUiMessages {
  return currentEditorMessages
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === 'ru' || value === 'en' || value === 'es'
}

export function isLocalePreference(
  value: unknown,
): value is AppLocalePreference {
  return value === 'system' || isSupportedLocale(value)
}
