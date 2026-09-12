import { en } from './en.locale.ts'

import type { Locale, LocalKey } from '#types/locales/locale.type.ts'
import type { Language } from '#types/settings/settings.type.ts'

export const locales = { en } satisfies Record<string, Locale>

function lookup(lang: Language, key: LocalKey): string {
  const dict = (locales as Record<string, Locale>)[lang]
  if (!dict) return key

  const raw = key.split('.').reduce<any>((obj, part) => obj?.[part], dict) ?? key
  return typeof raw === 'string' ? raw : key
}

export function createT(lang: Language) {
  return (key: LocalKey, params?: Record<string, string | number>): string => {
    const raw = lookup(lang, key)
    if (!params) return raw

    return raw.replace(/\{(\w+)\}/g, (_, name) => (name in params ? String(params[name]) : `{${name}}`))
  }
}

export type TFn = ReturnType<typeof createT>

export const t = createT('en')
