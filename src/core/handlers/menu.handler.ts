import type { Context } from 'grammy'
import { renderMenu } from '#core/commands/menu/menu.render.ts'

export async function handleMenuCallback(ctx: Context) {
  const queryData = ctx.callbackQuery?.data

  await ctx.answerCallbackQuery()

  if (queryData === 'menu_back') {
    await renderMenu(ctx, { editMessage: true })
  }
}
