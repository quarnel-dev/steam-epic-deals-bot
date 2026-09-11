import type { SteamAppDetails, SteamAppDetailsResponse } from '#types/sources/steam.type.ts'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1h

type CacheKey = string
interface CacheEntry {
  data: SteamAppDetails | null
  expiresAt: number
}

const cache = new Map<CacheKey, CacheEntry>()

function cacheKey(appid: number, cc: string): CacheKey {
  return `${appid}:${cc}`
}

export async function fetchSteamAppDetails(appid: number, cc: string = 'us'): Promise<SteamAppDetails | null> {
  const key = cacheKey(appid, cc)
  const cached = cache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=${cc}&l=en`)

    if (!res.ok) throw new Error(`Appdetails request failed: ${res.status}`)

    const json = (await res.json()) as SteamAppDetailsResponse
    const entry = json[String(appid)]

    const data = entry?.success ? (entry.data as SteamAppDetails) : null
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })

    return data
  } catch (err) {
    console.error(`Failed to fetch app details for ${appid} (cc=${cc}):`, err)
    cache.set(key, { data: null, expiresAt: Date.now() + CACHE_TTL_MS })
    return null
  }
}
