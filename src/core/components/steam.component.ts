import type { SteamFeaturedItem } from '#types/sources/steam.type.ts'
import { t } from '#locales/index.ts'

function formatPrice(amount: number | null, currency: string): string {
  if (amount === null) return 'N/A'
  const formated = (amount / 100).toFixed(2)
  return `${formated} ${currency}`
}

export function formatSteamDealCard(item: SteamFeaturedItem): string {
  const discountStr = `<b>-${item.discount_percent}%</b>`
  const originalPriceStr = formatPrice(item.original_price, item.currency)
  const finalPriceStr = formatPrice(item.final_price, item.currency)

  const priceStr = item.original_price ? `<s>${originalPriceStr}</s> <b>${finalPriceStr}</b>` : `<b>${finalPriceStr}</b>`

  return [`🎮 <b>${item.name}</b>`, ``, `🔥 ${t('deals.discount')}: ${discountStr}`, `💰 ${t('deals.price')}: ${priceStr}`].join(
    '\n'
  )
}
