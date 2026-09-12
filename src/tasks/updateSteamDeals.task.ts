import { fetchSteamDeals } from '#sources/steam.source.ts'
import { fetchSteamAppDetails } from '#sources/steamDetails.source.ts'
import { replaceSteamDeals, saveSteamAppDetails } from '#db/steam.db.ts'
import { CURRENCY_TO_CC } from '#types/settings/settings.type.ts'

import type { UpdateResult } from '#types/tasks/steamDeals.type.ts'

const APP_DETAILS_DELAY_MS = 300

const CCS = Object.values(CURRENCY_TO_CC)

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function updateSteamDeals(): Promise<UpdateResult[]> {
  const results: UpdateResult[] = []

  for (const cc of CCS) {
    const deals = await fetchSteamDeals(cc)
    const diff = replaceSteamDeals(cc, deals)

    for (const deal of deals) {
      try {
        const details = await fetchSteamAppDetails(deal.id, cc)
        if (details) saveSteamAppDetails(deal.id, cc, details)
      } catch (err) {
        console.error(`Failed to fetch details for ${deal.id} (cc=${cc}):`, err)
      }

      await sleep(APP_DETAILS_DELAY_MS)
    }

    results.push({ cc, total: deals.length, diff })
  }

  return results
}
