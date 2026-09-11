import { en } from './en.locale.ts'

import type { Locale, LocalKey } from '#types/locales/locale.type.ts'

export const locales = { en } satisfies Record<string, Locale>

export function t(key: LocalKey, params?: Record<string, string | number>): string {
  const raw =
    key.split('.').reduce<any>((obj, part) => obj?.[part], locales.en) ?? key

  if (typeof raw !== 'string' || !params) return raw

  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    name in params ? String(params[name]) : `{${name}}`
  )
}