import type { Context } from 'grammy'
import { getMenuKeyboard } from '#core/commands/menu/menu.keyboard.ts'
import { t } from '#locales/index.ts'

export async function handleMenuCallback(ctx: Context) {
  const queryData = ctx.callbackQuery?.data

  await ctx.answerCallbackQuery()

  if (queryData === 'menu_back') {
    const text = `${t('menu.title')}\n\n${t('menu.description')}`

    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: getMenuKeyboard(),
    })
  }
}
