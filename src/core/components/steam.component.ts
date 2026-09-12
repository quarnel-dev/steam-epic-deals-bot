import type { TFn } from '#locales/index.ts'
import type { SteamAppDetails, SteamFeaturedItem } from '#types/sources/steam.type.ts'

const DIVIDER = '━━━━━━━━━━━━━━━━━━'

function formatPrice(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`
}

function formatPlatforms(t: TFn, details?: SteamAppDetails | null): string {
  if (!details?.platforms) return ''

  const platforms: string[] = []
  if (details.platforms.windows) platforms.push(t('steam.deal.platformsWindows'))
  if (details.platforms.mac) platforms.push(t('steam.deal.platformsMac'))
  if (details.platforms.linux) platforms.push(t('steam.deal.platformsLinux'))

  return platforms.join(' / ')
}

export function componentSteamDealCard(t: TFn, deal: SteamFeaturedItem, details?: SteamAppDetails | null): string {
  const savings = (deal.original_price ?? deal.final_price) - deal.final_price
  const lines: string[] = []

  lines.push(t('steam.deal.title', { name: deal.name }))

  if (details?.short_description) {
    const desc =
      details.short_description.length > 150 ? `${details.short_description.slice(0, 150)}…` : details.short_description
    lines.push(`<i>${desc}</i>`)
  }

  lines.push('')
  lines.push(DIVIDER)
  lines.push('')

  lines.push(t('steam.deal.discount', { percent: deal.discount_percent }))

  if (deal.original_price) {
    lines.push(
      t('steam.deal.priceFrom', {
        original: formatPrice(deal.original_price, deal.currency),
        final: formatPrice(deal.final_price, deal.currency),
      })
    )
    lines.push(t('steam.deal.savings', { amount: formatPrice(savings, deal.currency) }))
  } else {
    lines.push(t('steam.deal.priceOnly', { price: formatPrice(deal.final_price, deal.currency) }))
  }

  const hasDetails =
    details?.genres?.length ||
    details?.developers?.length ||
    details?.metacritic?.score ||
    details?.recommendations?.total ||
    formatPlatforms(t, details)

  if (hasDetails) {
    lines.push('')
    lines.push(DIVIDER)
    lines.push('')

    if (details?.genres?.length) {
      lines.push(t('steam.deal.genres', { genres: details.genres.map((g) => g.description).join(', ') }))
    }

    if (details?.developers?.length) {
      lines.push(t('steam.deal.developers', { developers: details.developers.join(', ') }))
    }

    const meta: string[] = []
    if (details?.metacritic?.score) {
      meta.push(t('steam.deal.metacritic', { score: details.metacritic.score }))
    }
    if (details?.recommendations?.total) {
      meta.push(t('steam.deal.recommendations', { count: details.recommendations.total.toLocaleString() }))
    }
    if (meta.length) lines.push(meta.join('  •  '))

    const platforms = formatPlatforms(t, details)
    if (platforms) lines.push(t('steam.deal.platforms', { platforms }))
  }

  if (deal.discount_expiration) {
    const expDate = new Date(deal.discount_expiration * 1000)
    const formatted = expDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    lines.push('')
    lines.push(DIVIDER)
    lines.push('')
    lines.push(t('steam.deal.ends', { date: formatted }))
  }

  return lines.join('\n')
}
