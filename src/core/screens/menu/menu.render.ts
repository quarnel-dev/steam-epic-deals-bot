import type { AppContext } from '#types/context.type.ts'

import type { MenuOptions } from './menu.type.ts'
import { getMenuKeyboard } from './menu.keyboard.ts'

export async function renderMenu(ctx: AppContext, options: MenuOptions = {}) {
  const text = `${ctx.t('menu.title')}\n\n${ctx.t('menu.description')}`

  if (options.editMessage) {
    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: getMenuKeyboard(ctx.t),
    })
  } else {
    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: getMenuKeyboard(ctx.t),
    })
  }
}