import type { Bot } from 'grammy'
import cron from 'node-cron'

import { config } from './config.ts'

import { getPendingSteamChanges, markSteamChangesNotified } from '#db/steam.db.ts'
import { updateSteamDeals } from '#tasks/updateSteamDeals.task.ts'
import { broadcastSteamUpdate } from '#tasks/broadcastSteamUpdate.task.ts'

const DAILY_SCHEDULE = config.cronSchedule
const TIMEZONE = 'UTC'

async function primeCache(): Promise<void> {
  try {
    console.log('[ cron ] priming steam deals cache...')
    await updateSteamDeals()

    const pending = getPendingSteamChanges()
    markSteamChangesNotified(pending.map((c) => c.id))

    console.log(`[ cron ] cache primed, ${pending.length} changes suppressed`)
  } catch (err) {
    console.error('[ cron ] failed to prime steam deals cache:', err)
  }
}

async function runDailyUpdate(bot: Bot): Promise<void> {
  try {
    console.log('[ cron ] running daily steam deals update...')

    const results = await updateSteamDeals()
    await broadcastSteamUpdate(bot, results)
    console.log('[ cron ] daily update finished')
  } catch (err) {
    console.error('[ cron ] daily steam update failed: ', err)
  }
}

export function startCronJobs(bot: Bot): void {
  primeCache()

  cron.schedule(
    DAILY_SCHEDULE,
    () => {
      runDailyUpdate(bot)
    },
    { timezone: TIMEZONE }
  )

  console.log(`[ cron ] scheduled daily steam update at ${DAILY_SCHEDULE} (${TIMEZONE})`)
}
