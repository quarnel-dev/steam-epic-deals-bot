import type { Context } from 'grammy'
import { renderMenu } from '#core/screens/menu/menu.render.ts'
import { renderSteamMenu } from '#core/screens/steam/steam.render.ts'

export async function handleMenuCallback(ctx: Context) {
  const queryData = ctx.callbackQuery?.data

  await ctx.answerCallbackQuery()

  if (queryData === 'menu_back') {
    if (ctx.callbackQuery?.message?.photo) {
      await ctx.deleteMessage().catch(() => {})
      await renderMenu(ctx, { editMessage: false })
    } else {
      await renderMenu(ctx, { editMessage: true })
    }
    return
  }

  if (queryData === 'menu_steam') {
    await renderSteamMenu(ctx)
    return
  }
}
