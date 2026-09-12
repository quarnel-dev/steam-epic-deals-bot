import type { Context } from 'grammy'

import { getUserSettings } from '#db/users.db.ts'
import { t } from '#locales/index.ts'
import { getCurrencyKeyboard, getLanguageKeyboard, getSettingsKeyboard } from './settings.keyboard.ts'
import type { SettingsOptions } from './settings.type.ts'

function buildText(header: string, body: string) {
  return `${header}\n\n${body}`
}

export async function renderSettings(ctx: Context, options: SettingsOptions = {}) {
  const userId = ctx.from!.id
  const settings = getUserSettings(userId)

  const text = buildText(t('settings.title'), t('settings.description'))

  if (options.editMessage && ctx.callbackQuery && !ctx.callbackQuery.message?.photo) {
    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: getSettingsKeyboard(settings),
    })
    return
  }

  if (ctx.callbackQuery?.message?.photo) {
    await ctx.deleteMessage().catch(() => {})
  }

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getSettingsKeyboard(settings),
  })
}

export async function renderLanguagePicker(ctx: Context) {
  await ctx.editMessageText(t('settings.labels.language'), {
    parse_mode: 'HTML',
    reply_markup: getLanguageKeyboard(),
  })
}

export async function renderCurrencyPicker(ctx: Context) {
  const settings = getUserSettings(ctx.from!.id)

  await ctx.editMessageText(t('settings.labels.currency'), {
    parse_mode: 'HTML',
    reply_markup: getCurrencyKeyboard(settings.currency),
  })
}
