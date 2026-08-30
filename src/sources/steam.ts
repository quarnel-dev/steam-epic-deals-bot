import type { SteamFeaturedCategoriesResponse, SteamFeaturedItem } from '#types/sources/steam.ts'

const STEAM_API_URL = 'https://store.steampowered.com/api/featuredcategories'

export async function fetchSteamDeals(): Promise<SteamFeaturedItem[]> {
  const res = await fetch(STEAM_API_URL)

  if (!res.ok) {
    throw new Error(`Steam API request failed with status ${res.status}`)
  }

  const data = (await res.json()) as SteamFeaturedCategoriesResponse

  return data.specials.items.filter((item) => item.discounted)
}
