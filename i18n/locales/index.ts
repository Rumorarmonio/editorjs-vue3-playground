import { en } from './en'
import { es } from './es'
import { ru } from './ru'
import type { SupportedLocale } from '~~/i18n/editor'

export const appMessages: Record<SupportedLocale, typeof ru> = {
  ru,
  en,
  es,
}
