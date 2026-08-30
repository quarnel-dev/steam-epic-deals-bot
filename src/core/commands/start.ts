import type { Context } from 'grammy'

import { t } from '#locales/index.ts'

export function startCommand(ctx: Context) {
  return ctx.reply(t('start.welcome'), {
    parse_mode: 'HTML',
  })
}
