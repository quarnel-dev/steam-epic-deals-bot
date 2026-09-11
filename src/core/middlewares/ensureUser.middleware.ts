import type { Context, NextFunction } from 'grammy'

import { getUserSettings } from '#db/index.ts'

export async function ensureUser(ctx: Context, next: NextFunction) {
  if (ctx.from) {
    getUserSettings(ctx.from.id)
  }

  await next()
}
