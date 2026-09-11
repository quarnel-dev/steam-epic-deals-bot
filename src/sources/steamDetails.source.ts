import type { SteamAppDetails, SteamAppDetailsResponse } from '#types/sources/steam.type.ts'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1h
const cache = new Map<number, { data: SteamAppDetails | null; expiresAt: number }>()

export async function fetchSteamAppDetails(appid: number): Promise<SteamAppDetails | null> {
  const cached = cache.get(appid)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`)

    if (!res.ok) throw new Error(`Appdetails request failed: ${res.status}`)

    const json = (await res.json()) as SteamAppDetailsResponse
    const entry = json[String(appid)]

    const data = entry?.success ? (entry.data as SteamAppDetails) : null
    cache.set(appid, { data, expiresAt: Date.now() + CACHE_TTL_MS })

    return data
  } catch (err) {
    console.error(`Failed to fetch app details for ${appid}:`, err)
    cache.set(appid, { data: null, expiresAt: Date.now() + CACHE_TTL_MS })
    return null
  }
}
