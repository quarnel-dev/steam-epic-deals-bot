import type { AppContext } from '#types/context.type.ts'

import { getCurrencyKeyboard, getLanguageKeyboard, getSettingsKeyboard } from './settings.keyboard.ts'
import type { SettingsOptions } from './settings.type.ts'

function buildText(header: string, body: string) {
  return `${header}\n\n${body}`
}

export async function renderSettings(ctx: AppContext, options: SettingsOptions = {}) {
  const text = buildText(ctx.t('settings.title'), ctx.t('settings.description'))

  if (options.editMessage && ctx.callbackQuery && !ctx.callbackQuery.message?.photo) {
    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: getSettingsKeyboard(ctx.t, ctx.settings),
    })
    return
  }

  if (ctx.callbackQuery?.message?.photo) {
    await ctx.deleteMessage().catch(() => {})
  }

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getSettingsKeyboard(ctx.t, ctx.settings),
  })
}

export async function renderLanguagePicker(ctx: AppContext) {
  await ctx.editMessageText(ctx.t('settings.labels.language'), {
    parse_mode: 'HTML',
    reply_markup: getLanguageKeyboard(ctx.t),
  })
}

export async function renderCurrencyPicker(ctx: AppContext) {
  await ctx.editMessageText(ctx.t('settings.labels.currency'), {
    parse_mode: 'HTML',
    reply_markup: getCurrencyKeyboard(ctx.t, ctx.settings.currency),
  })
}
