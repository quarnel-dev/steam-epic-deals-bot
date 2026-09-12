import type { Context } from 'grammy'

import type { MenuOptions } from './menu.type.ts'

import { getMenuKeyboard } from './menu.keyboard.ts'

import { t } from '#locales/index.ts'

export async function renderMenu(ctx: Context, options: MenuOptions = {}) {
  const text = `${t('menu.title')}\n\n${t('menu.description')}`

  if (options.editMessage) {
    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: getMenuKeyboard(),
    })
  } else {
    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: getMenuKeyboard(),
    })
  }
}
