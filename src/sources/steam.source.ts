import type { SteamFeaturedCategoriesResponse, SteamFeaturedItem } from '#types/sources/steam.type.ts'

const STEAM_API_URL = 'https://store.steampowered.com/api/featuredcategories?cc=us&l=en'

export async function fetchSteamDeals(): Promise<SteamFeaturedItem[]> {
  const res = await fetch(STEAM_API_URL)

  if (!res.ok) {
    throw new Error(`Steam API request failed with status ${res.status}`)
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
