import { t } from '#locales/index.ts'

import type { SteamFeaturedItem } from '#types/sources/steam.ts'

export function formatSteamDeals(items: SteamFeaturedItem[]): string {
  if (items.length === 0) {
    return `<b>${t('deals.empty')}</b>`
  }

  const header = `<b>${t('deals.header')}</b>`

  const dealsList = items
    .map((item) => {
      const originalPrice = item.original_price ? (item.original_price / 100).toFixed(2) : ''
      const finalPrice = (item.final_price / 100).toFixed(2)
      const currency = item.currency

      const priceText = item.original_price
        ? `<s>${originalPrice} ${currency}</s> <b>${finalPrice} ${currency}</b>`
        : `<b>${finalPrice} ${currency}</b>`

      const url = `https://store.steampowered.com/app/${item.id}`

      return `• <a href="${url}">${item.name}</a>\n  ${t('deals.discount')}: <b>-${item.discount_percent}%</b> | ${t('deals.price')}: ${priceText}`
    })
    .join('\n\n')

  return header + dealsList
}
