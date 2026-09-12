import { fetchSteamDeals } from '#sources/steam.source.ts'
import { fetchSteamAppDetails } from '#sources/steamDetails.source.ts'
import { replaceSteamDeals, saveSteamAppDetails } from '#db/steam.db.ts'
import { CURRENCY_TO_CC } from '#types/settings/settings.type.ts'
import { sleep } from '#utils/sleep.util.ts'
import { logger } from '#logger/index.ts'

import type { UpdateResult } from '#types/tasks/steamDeals.type.ts'

const APP_DETAILS_DELAY_MS = 300

const CCS = Object.values(CURRENCY_TO_CC)

export async function updateSteamDeals(): Promise<UpdateResult[]> {
  const start = Date.now()
  const results: UpdateResult[] = []

  logger.info(`updating steam deals for ${CCS.length} regions`, { module: 'steam.task', regions: CCS })

  for (const cc of CCS) {
    const regionStart = Date.now()

    logger.debug(`fetching featured deals for cc=${cc}`, { module: 'steam.task', cc })

    const deals = await fetchSteamDeals(cc)
    const diff = replaceSteamDeals(cc, deals)

    logger.debug(`saved ${deals.length} deals for cc=${cc}`, {
      module: 'steam.task',
      cc,
      count: deals.length,
      added: diff.added.length,
      changed: diff.changed.length,
      removed: diff.removed.length,
    })

    for (const deal of deals) {
      try {
        const details = await fetchSteamAppDetails(deal.id, cc)

        if (details) {
          saveSteamAppDetails(deal.id, cc, details)
          logger.debug(`saved details for ${deal.id} (cc=${cc})`, {
            module: 'steam.task',
            cc,
            appId: deal.id,
          })
        } else {
          logger.warn(`no details returned for ${deal.id} (cc=${cc})`, {
            module: 'steam.task',
            cc,
            appId: deal.id,
          })
        }
      } catch (err) {
        logger.error(`failed to fetch details for ${deal.id} (cc=${cc})`, {
          module: 'steam.task',
          cc,
          appId: deal.id,
          err,
        })
      }

      await sleep(APP_DETAILS_DELAY_MS)
    }

    logger.info(`region cc=${cc} updated`, {
      module: 'steam.task',
      cc,
      total: deals.length,
      durationMs: Date.now() - regionStart,
    })

    results.push({ cc, total: deals.length, diff })
  }

  logger.info('steam deals update finished', {
    module: 'steam.task',
    regions: CCS.length,
    durationMs: Date.now() - start,
  })

  return results
}
