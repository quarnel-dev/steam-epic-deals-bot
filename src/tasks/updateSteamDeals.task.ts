import { fetchSteamDeals } from '#sources/steam.source.ts'
import { fetchSteamAppDetails } from '#sources/steamDetails.source.ts'
import { replaceSteamDeals, saveSteamAppDetails } from '#db/steam.db.ts'
import { CURRENCY_TO_CC, LANGUAGES, LANGUAGE_TO_STEAM_LANG } from '#types/settings/settings.type.ts'
import { sleep } from '#utils/sleep.util.ts'
import { logger } from '#logger/index.ts'

import type { UpdateResult } from '#types/tasks/steamDeals.type.ts'

const APP_DETAILS_DELAY_MS = 300

const CCS = Object.values(CURRENCY_TO_CC)

export async function updateSteamDeals(): Promise<UpdateResult[]> {
  const start = Date.now()
  const results: UpdateResult[] = []

  logger.info(`updating steam deals for ${CCS.length} regions × ${LANGUAGES.length} languages`, {
    module: 'steam.task',
    regions: CCS,
    languages: LANGUAGES,
  })

  for (const cc of CCS) {
    for (const lang of LANGUAGES) {
      const steamLang = LANGUAGE_TO_STEAM_LANG[lang]
      const startKey = Date.now()

      logger.debug(`fetching deals for cc=${cc} lang=${lang}`, { module: 'steam.task', cc, lang })

      const deals = await fetchSteamDeals(cc, steamLang)
      const diff = replaceSteamDeals(cc, lang, deals)

      logger.debug(`saved ${deals.length} deals for cc=${cc} lang=${lang}`, {
        module: 'steam.task',
        cc,
        lang,
        count: deals.length,
        added: diff.added.length,
        changed: diff.changed.length,
        removed: diff.removed.length,
      })

      for (const deal of deals) {
        try {
          const details = await fetchSteamAppDetails(deal.id, cc, steamLang)

          if (details) {
            saveSteamAppDetails(deal.id, cc, lang, details)
            logger.debug(`saved details for ${deal.id} (cc=${cc}, lang=${lang})`, {
              module: 'steam.task',
              cc,
              lang,
              appId: deal.id,
            })
          } else {
            logger.warn(`no details returned for ${deal.id} (cc=${cc}, lang=${lang})`, {
              module: 'steam.task',
              cc,
              lang,
              appId: deal.id,
            })
          }
        } catch (err) {
          logger.error(`failed to fetch details for ${deal.id} (cc=${cc}, lang=${lang})`, {
            module: 'steam.task',
            cc,
            lang,
            appId: deal.id,
            err,
          })
        }

        await sleep(APP_DETAILS_DELAY_MS)
      }

      logger.info(`region cc=${cc} lang=${lang} updated`, {
        module: 'steam.task',
        cc,
        lang,
        total: deals.length,
        durationMs: Date.now() - startKey,
      })

      results.push({ cc, lang, total: deals.length, diff })
    }
  }

  logger.info('steam deals update finished', {
    module: 'steam.task',
    regions: CCS.length,
    languages: LANGUAGES.length,
    totalRuns: CCS.length * LANGUAGES.length,
    durationMs: Date.now() - start,
  })

  return results
}
