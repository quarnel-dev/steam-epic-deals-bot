import { InlineKeyboard } from 'grammy'
import type { TFn } from '#locales/index.ts'

import type { SteamFilter } from '#types/sources/steam.type.ts'

export function getSteamKeyboard(t: TFn) {
  return new InlineKeyboard()
    .text(t('steam.buttons.top'), 'steam_filter_top')
    .row()
    .text(t('steam.buttons.discount50'), 'steam_filter_d50')
    .text(t('steam.buttons.discount75'), 'steam_filter_d75')
    .text(t('steam.buttons.discount90'), 'steam_filter_d90')
    .row()
    .text(t('buttons.back'), 'menu_back')
}

export function getSteamPaginationKeyboard(t: TFn, filter: SteamFilter, index: number, total: number, gameUrl: string) {
  const kb = new InlineKeyboard()

  if (index > 0) {
    kb.text('⬅️', `steam_page_${filter}_${index - 1}`)
  } else {
    kb.text('⏹️', 'noop')
  }

  kb.text(`${index + 1}/${total}`, 'noop')

  if (index < total - 1) {
    kb.text('➡️', `steam_page_${filter}_${index + 1}`)
  } else {
    kb.text('⏹️', 'noop')
  }

  kb.row().url(t('steam.buttons.open'), gameUrl)

  kb.row().text(t('buttons.back'), 'steam_menu')

  return kb
}

export function getSteamOpenKeyboard(t: TFn, gameUrl: string) {
  return new InlineKeyboard().url(t('steam.buttons.open'), gameUrl)
}
