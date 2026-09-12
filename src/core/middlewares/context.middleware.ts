import type { Middleware } from 'grammy'

import { getUserSettings } from '#db/users.db.ts'
import { createT } from '#locales/index.ts'

import type { AppContext } from '#types/context.type.ts'

export function contextMiddleware(): Middleware<AppContext> {
  return async (ctx, next) => {
    if (ctx.from) {
      const settings = getUserSettings(ctx.from.id)
      ctx.settings = settings
      ctx.t = createT(settings.language)
    }

    await next()
  }
}
