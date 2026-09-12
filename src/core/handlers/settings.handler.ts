import { setCurrency, setLanguage, setNotification } from '#db/users.db.ts'
import type { Currency, Language } from '#types/settings/settings.type.ts'
import { CURRENCIES, LANGUAGES } from '#types/settings/settings.type.ts'
import { renderCurrencyPicker, renderLanguagePicker, renderSettings } from '#core/screens/settings/settings.render.ts'
import { getUserSettings } from '#db/users.db.ts'
import { createT } from '#locales/index.ts'

import type { AppContext } from '#types/context.type.ts'

function refreshContext(ctx: AppContext) {
  const settings = getUserSettings(ctx.from!.id)
  ctx.settings = settings
  ctx.t = createT(settings.language)
}

export async function handleSettingsCallback(ctx: AppContext) {
  const queryData = ctx.callbackQuery?.data
  if (!queryData) return

  await ctx.answerCallbackQuery()

  const userId = ctx.from!.id

  if (queryData === 'settings_menu') {
    await renderSettings(ctx, { editMessage: true })
    return
  }

  if (queryData === 'settings_language') {
    await renderLanguagePicker(ctx)
    return
  }

  if (queryData === 'settings_currency') {
    await renderCurrencyPicker(ctx)
    return
  }

  if (queryData.startsWith('settings_set_language_')) {
    const lang = queryData.replace('settings_set_language_', '') as Language
    if (LANGUAGES.includes(lang)) setLanguage(userId, lang)
    refreshContext(ctx)
    await renderSettings(ctx, { editMessage: true })
    return
  }

  if (queryData.startsWith('settings_set_currency_')) {
    const currency = queryData.replace('settings_set_currency_', '') as Currency
    if (CURRENCIES.includes(currency)) setCurrency(userId, currency)
    refreshContext(ctx)
    await renderSettings(ctx, { editMessage: true })
    return
  }

  if (queryData === 'settings_toggle_epic') {
    setNotification(userId, 'epic', !ctx.settings.epic_notifications)
    refreshContext(ctx)
    await renderSettings(ctx, { editMessage: true })
    return
  }

  if (queryData === 'settings_toggle_steam') {
    setNotification(userId, 'steam', !ctx.settings.steam_notifications)
    refreshContext(ctx)
    await renderSettings(ctx, { editMessage: true })
    return
  }
}
