import { en } from './en.locale.ts'

import type { Locale, LocalKey } from '#types/locales/locale.type.ts'

export const locales = { en } satisfies Record<string, Locale>

export function t(key: LocalKey): string {
  return key.split('.').reduce((obj: any, part) => obj?.[part], locales.en) ?? key
}
