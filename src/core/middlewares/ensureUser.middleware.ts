import type { Context, NextFunction } from 'grammy'

import { getUserSettings } from '#db/users.db.ts'
import type { Language } from '#types/settings/settings.type.ts'

function resolveLanguage(code: string | undefined): Language {
  if (!code) return 'en'
  if (code.startsWith('ru') || code.startsWith('uk') || code.startsWith('be') || code.startsWith('kk')) {
    return 'ru'
  }
  return 'en'
}

export async function ensureUser(ctx: Context, next: NextFunction) {
  if (ctx.from) {
    getUserSettings(ctx.from.id, resolveLanguage(ctx.from.language_code))
  }
  await next()
}
