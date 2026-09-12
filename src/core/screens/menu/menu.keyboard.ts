import { InlineKeyboard } from 'grammy'

import type { TFn } from '#locales/index.ts'

export function getMenuKeyboard(t: TFn) {
  return new InlineKeyboard()
    .text(t('menu.buttons.steam'), 'menu_steam')
    .text(t('menu.buttons.epic'), 'menu_epic')
    .row()
    .text(t('menu.buttons.settings'), 'menu_settings')
}