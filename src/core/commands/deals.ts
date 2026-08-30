import type { CommandContext, Context } from 'grammy'

import { fetchSteamDeals } from '#sources/steam.ts'
import { formatSteamDeals } from '#core/formatters/steam.ts'

import { t } from '#locales/index.ts'

export async function dealsCommand(ctx: CommandContext<Context>) {
  await ctx.reply(t('deals.loading'))

  try {
    const deals = await fetchSteamDeals()
    const message = formatSteamDeals(deals)

    await ctx.reply(message, {
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
    })
  } catch (err) {
    console.error('Error fetching Steam deals:', err)
    await ctx.reply(t('deals.error'))
  }
}
