import type { Bot } from 'grammy'

import { getPendingSteamChanges, markSteamChangesNotified, getSteamAppDetails, getSteamDealsAsFeatured } from '#db/steam.db.ts'
import { getUserIdsForChannel } from '#db/users.db.ts'
import { componentSteamDealCard } from '#core/components/steam.component.ts'
import { getSteamOpenKeyboard } from '#core/screens/steam/steam.keyboard.ts'
import { t } from '#locales/index.ts'
import { sleep } from '#utils/sleep.util.ts'
import { logger } from '#logger/index.ts'

import type { SteamFeaturedItem } from '#types/sources/steam.type.ts'
import type { UpdateResult } from '#types/tasks/steamDeals.type.ts'
import type { BroadcastResult } from '#types/tasks/steamBroadcast.type.ts'

const MESSAGE_DELAY_MIN_MS = 10000
const MESSAGE_DELAY_MAX_MS = 20000
const USER_DELAY_MS = 75

const STEAM_FALLBACK_IMAGE = 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016'

function randomDelay(): number {
  const range = MESSAGE_DELAY_MAX_MS - MESSAGE_DELAY_MIN_MS
  return MESSAGE_DELAY_MIN_MS + Math.floor(Math.random() * range)
}

function buildSummaryMessage(results: UpdateResult[]): string {
  const totalBefore = results.reduce((sum, r) => sum + r.total - r.diff.added.length + r.diff.removed.length, 0)
  const totalAfter = results.reduce((sum, r) => sum + r.total, 0)
  const added = results.reduce((sum, r) => sum + r.diff.added.length, 0)
  const changed = results.reduce((sum, r) => sum + r.diff.changed.length, 0)
  const removed = results.reduce((sum, r) => sum + r.diff.removed.length, 0)

  return t('steam.update.summary', { before: totalBefore, after: totalAfter, added, changed, removed })
}

function buildRemovedMessage(results: UpdateResult[]): string | null {
  const removed = results.flatMap((r) => r.diff.removed)
  if (removed.length === 0) return null

  return t('steam.update.removed', { count: removed.length })
}

function pickTopDeal(results: UpdateResult[]): { deal: SteamFeaturedItem; cc: string } | null {
  const added = results.flatMap((r) => r.diff.added.map((row) => ({ row, cc: r.cc })))

  if (added.length > 0) {
    const top = [...added].sort((a, b) => b.row.discount_percent - a.row.discount_percent)[0]
    const deal = getSteamDealsAsFeatured(top.cc).find((d) => d.id === top.row.app_id)
    if (deal) return { deal, cc: top.cc }
  }

  const changed = results.flatMap((r) => r.diff.changed.map((c) => ({ c, cc: r.cc })))

  if (changed.length > 0) {
    const top = [...changed].sort((a, b) => b.c.new_discount - a.c.new_discount)[0]
    const deal = getSteamDealsAsFeatured(top.cc).find((d) => d.id === top.c.app_id)
    if (deal) return { deal, cc: top.cc }
  }

  return null
}

async function sendUserMessages(bot: Bot, userId: number, results: UpdateResult[]): Promise<boolean> {
  try {
    await bot.api.sendMessage(userId, buildSummaryMessage(results), { parse_mode: 'HTML' })
    await sleep(randomDelay())

    const top = pickTopDeal(results)

    if (top) {
      logger.debug(`sending top deal card to user`, {
        module: 'broadcast.task',
        userId,
        appId: top.deal.id,
        cc: top.cc,
      })

      const details = getSteamAppDetails(top.deal.id, top.cc)
      const caption = componentSteamDealCard(top.deal, details)
      const gameUrl = `https://store.steampowered.com/app/${top.deal.id}`
      const keyboard = getSteamOpenKeyboard(gameUrl)
      const imageUrl = top.deal.header_image || STEAM_FALLBACK_IMAGE

      await bot.api.sendPhoto(userId, imageUrl, {
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      })

      await sleep(randomDelay())
    }

    const removed = buildRemovedMessage(results)
    if (removed) {
      await bot.api.sendMessage(userId, removed, { parse_mode: 'HTML' })
    }

    return true
  } catch (err) {
    logger.error('failed to notify user', { module: 'broadcast.task', userId, err })
    return false
  }
}

export async function broadcastSteamUpdate(bot: Bot, results: UpdateResult[]): Promise<BroadcastResult> {
  const start = Date.now()
  const pending = getPendingSteamChanges()
  const result: BroadcastResult = { sent: 0, failed: 0, skipped: 0 }

  if (pending.length === 0) {
    logger.debug('no pending changes, skipping broadcast', { module: 'broadcast.task' })
    return result
  }

  const userIds = getUserIdsForChannel('steam')

  if (userIds.length === 0) {
    logger.warn('no steam subscribers to notify', { module: 'broadcast.task', changes: pending.length })
    markSteamChangesNotified(pending.map((c) => c.id))
    return result
  }

  logger.info(`broadcasting steam update to ${userIds.length} users`, {
    module: 'broadcast.task',
    users: userIds.length,
    changes: pending.length,
  })

  for (const userId of userIds) {
    const ok = await sendUserMessages(bot, userId, results)

    if (ok) {
      result.sent++
    } else {
      result.failed++
    }

    await sleep(USER_DELAY_MS)
  }

  markSteamChangesNotified(pending.map((c) => c.id))

  logger.info('broadcast finished', {
    module: 'broadcast.task',
    sent: result.sent,
    failed: result.failed,
    durationMs: Date.now() - start,
  })

  return result
}
