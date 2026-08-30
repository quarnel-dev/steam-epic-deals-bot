import type { Context } from 'grammy'

import { t } from '#locales/index.ts'
import { renderMenu } from '../menu/menu.render.ts'

export async function renderStart(ctx: Context) {
  const text = `${t('start.welcome')}\n\n${t('start.description')}\n\n${t('start.instruction')}`

  await ctx.reply(text, {
    parse_mode: 'HTML',
  })

  await renderMenu(ctx, { editMessage: false })
}
