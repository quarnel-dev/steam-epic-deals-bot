import type { SteamFeaturedCategoriesResponse, SteamFeaturedItem } from '#types/sources/steam.type.ts'

const STEAM_API_URL = 'https://store.steampowered.com/api/featuredcategories'

export async function fetchSteamDeals(cc: string = 'us'): Promise<SteamFeaturedItem[]> {
  const url = `${STEAM_API_URL}?cc=${cc}&l=en`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`)
  }

  const data = (await res.json()) as SteamFeaturedCategoriesResponse
  const items = data.specials?.items ?? []

  return items
    .filter((item) => item.discounted)
    .map((item) => ({
      ...item,
      header_image: item.header_image || item.large_capsule_image || item.small_capsule_image || '',
    }))
    .filter((item) => item.header_image.length > 0)
}