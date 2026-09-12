import type { SteamFeaturedCategoriesResponse, SteamFeaturedItem } from '#types/sources/steam.type.ts'
import { logger } from '#logger/index.ts'

const STEAM_API_URL = 'https://store.steampowered.com/api/featuredcategories'

export async function fetchSteamDeals(cc: string = 'us', lang: string = 'en'): Promise<SteamFeaturedItem[]> {
  const url = `${STEAM_API_URL}?cc=${cc}&l=${lang}`

  logger.debug('fetching featured categories', { module: 'steam.source', cc, lang })

  const res = await fetch(url)

  if (!res.ok) {
    logger.error('steam api responded with error', { module: 'steam.source', cc, lang, status: res.status })
    throw new Error(`Steam API error: ${res.status}`)
  }

  const data = (await res.json()) as SteamFeaturedCategoriesResponse
  const items = data.specials?.items ?? []

  const deals = items
    .filter((item) => item.discounted)
    .map((item) => ({
      ...item,
      header_image: item.header_image || item.large_capsule_image || item.small_capsule_image || '',
    }))
    .filter((item) => item.header_image.length > 0)

  logger.debug('featured categories fetched', {
    module: 'steam.source',
    cc,
    lang,
    total: items.length,
    deals: deals.length,
  })

  return deals
}