import { Context } from 'grammy'
import { InlineKeyboard } from 'grammy'

import { t } from '#locales/index.ts'

export function getMenuKeyboard() {
  return new InlineKeyboard()
    .text(t('menu.buttons.steam'), 'menu_steam')
    .text(t('menu.buttons.epic'), 'menu_epic')
    .row()
    .text(t('menu.buttons.settings'), 'menu_settings')
}

export async function menuCommand(ctx: Context) {
  const text = `${t('menu.title')}\n\n${t('menu.description')}`

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getMenuKeyboard(),
  })
}
