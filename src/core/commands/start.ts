import type { Context } from 'grammy'

import { t } from '#locales/index.ts'
import { menuCommand } from './menu/menu.command.ts'

export async function startCommand(ctx: Context) {
  const welcomeText = `${t('start.welcome')}\n\n${t('start.description')}\n\n${t('start.instruction')}`

  await ctx.reply(welcomeText, {
    parse_mode: 'HTML',
  })

  await menuCommand(ctx)
}
