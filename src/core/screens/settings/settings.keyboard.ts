import { InlineKeyboard } from 'grammy'

import { CURRENCIES, LANGUAGES } from '#types/settings/settings.type.ts'

import type { UserSettings, Currency } from '#types/settings/settings.type.ts'
import type { TFn } from '#locales/index.ts'

export function getSettingsKeyboard(t: TFn, settings: UserSettings) {
  const kb = new InlineKeyboard()

  kb.text(`🌐 ${t('settings.labels.language')}: ${settings.language.toUpperCase()}`, 'settings_language')
  kb.row()
  kb.text(`💱 ${t('settings.labels.currency')}: ${settings.currency}`, 'settings_currency')
  kb.row()
  kb.text(
    `🎁 ${t('settings.labels.epicNotifications')}: ${settings.epic_notifications ? t('settings.values.on') : t('settings.values.off')}`,
    'settings_toggle_epic'
  )
  kb.row()
  kb.text(
    `🎮 ${t('settings.labels.steamNotifications')}: ${settings.steam_notifications ? t('settings.values.on') : t('settings.values.off')}`,
    'settings_toggle_steam'
  )
  kb.row()
  kb.text(t('buttons.back'), 'menu_back')

  return kb
}

export function getLanguageKeyboard(t: TFn) {
  const kb = new InlineKeyboard()

  for (const lang of LANGUAGES) {
    kb.text(lang.toUpperCase(), `settings_set_language_${lang}`)
  }
  kb.row().text(t('buttons.back'), 'settings_menu')

  return kb
}

export function getCurrencyKeyboard(t: TFn, current: Currency) {
  const kb = new InlineKeyboard()

  CURRENCIES.forEach((currency, i) => {
    const label = currency === current ? `• ${currency}` : currency
    kb.text(label, `settings_set_currency_${currency}`)
    if (i % 2 === 1 && i !== CURRENCIES.length - 1) kb.row()
  })
  kb.row().text(t('buttons.back'), 'settings_menu')

  return kb
}
