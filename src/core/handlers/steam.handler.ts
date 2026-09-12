import type { AppContext } from '#types/context.type.ts'

import type { SteamFilter } from '#types/sources/steam.type.ts'
import { renderSteamMenu, renderSteamCard } from '#core/screens/steam/steam.render.ts'

export async function handleSteamCallback(ctx: AppContext) {
  const queryData = ctx.callbackQuery?.data
  if (!queryData) return

  await ctx.answerCallbackQuery()

  if (queryData === 'steam_menu') {
    if (ctx.callbackQuery.message?.photo) {
      await ctx.deleteMessage().catch(() => {})
    }
    await renderSteamMenu(ctx)
    return
  }

  if (queryData.startsWith('steam_filter_')) {
    const filter = queryData.replace('steam_filter_', '') as SteamFilter
    await renderSteamCard(ctx, filter, 0)
    return
  }

  if (queryData.startsWith('steam_page_')) {
    const parts = queryData.split('_')
    const filter = parts[2] as SteamFilter
    const pageIndex = parseInt(parts[3], 10) || 0

    await renderSteamCard(ctx, filter, pageIndex)
    return
  }
}
