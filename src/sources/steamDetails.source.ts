import type { SteamAppDetails, SteamAppDetailsResponse } from '#types/sources/steam.type.ts'
import { logger } from '#logger/index.ts'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1h

type CacheKey = string
interface CacheEntry {
  data: SteamAppDetails | null
  expiresAt: number
}

const cache = new Map<CacheKey, CacheEntry>()

function cacheKey(appid: number, cc: string, lang: string): CacheKey {
  return `${appid}:${cc}:${lang}`
}

export async function fetchSteamAppDetails(
  appid: number,
  cc: string = 'us',
  lang: string = 'en'
): Promise<SteamAppDetails | null> {
  const key = cacheKey(appid, cc, lang)
  const cached = cache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    logger.debug('app details cache hit', { module: 'steamDetails.source', appid, cc, lang })
    return cached.data
  }

  logger.debug('app details cache miss, fetching', { module: 'steamDetails.source', appid, cc, lang })

  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=${cc}&l=${lang}`)

    if (!res.ok) throw new Error(`Appdetails request failed: ${res.status}`)

    const json = (await res.json()) as SteamAppDetailsResponse
    const entry = json[String(appid)]

    const data = entry?.success ? (entry.data as SteamAppDetails) : null

    if (!data) {
      logger.warn('app details returned no data', { module: 'steamDetails.source', appid, cc, lang })
    }

    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })

    return data
  } catch (err) {
    logger.error('failed to fetch app details', { module: 'steamDetails.source', appid, cc, lang, err })
    cache.set(key, { data: null, expiresAt: Date.now() + CACHE_TTL_MS })
    return null
  }
}
