import type { Bot } from 'grammy'
import cron from 'node-cron'

import { config } from './config.ts'

import { getPendingSteamChanges, markSteamChangesNotified } from '#db/steam.db.ts'
import { updateSteamDeals } from '#tasks/updateSteamDeals.task.ts'
import { broadcastSteamUpdate } from '#tasks/broadcastSteamUpdate.task.ts'

import { logger } from '#logger/index.ts'

const DAILY_SCHEDULE = config.cronSchedule
const TIMEZONE = 'UTC'

async function primeCache(): Promise<void> {
  const start = Date.now()
  try {
    logger.info('priming steam deals cache...', { module: 'cron' })
    await updateSteamDeals()

    const pending = getPendingSteamChanges()
    markSteamChangesNotified(pending.map((c) => c.id))

    logger.info(`cache primed, ${pending.length} changes suppressed`, { module: 'cron', durationsMs: Date.now() - start })
  } catch (err) {
    logger.error('failed to prime steam deals cache', { module: 'cron', err })
  }
}

async function runDailyUpdate(bot: Bot): Promise<void> {
  const start = Date.now()
  try {
    logger.info('running daily steam deals update...', { module: 'cron' })

    const results = await updateSteamDeals()
    await broadcastSteamUpdate(bot, results)

    logger.info('daily update finished', {
      module: 'cron',
      durationMs: Date.now() - start,
    })
  } catch (err) {
    logger.error('daily steam update failed', { module: 'cron', err })
  }
}

export function startCronJobs(bot: Bot): void {
  logger.debug('registering cron schedule', { module: 'cron', schedule: DAILY_SCHEDULE })

  primeCache()

  cron.schedule(
    DAILY_SCHEDULE,
    () => {
      runDailyUpdate(bot)
    },
    { timezone: TIMEZONE }
  )

  logger.info(`scheduled daily steam update at ${DAILY_SCHEDULE} (${TIMEZONE})`, { module: 'cron' })
}
