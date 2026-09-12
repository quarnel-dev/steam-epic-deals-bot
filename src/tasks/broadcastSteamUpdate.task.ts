import type { Bot } from 'grammy'

import { getPendingSteamChanges, markSteamChangesNotified } from '#db/steam.db.ts'
import { getUserIdsForChannel } from '#db/users.db.ts'
import { t } from '#locales/index.ts'
import { sleep } from '#utils/sleep.util.ts'

import type { UpdateResult } from '#types/tasks/steamDeals.type.ts'
import type { BroadcastResult } from '#types/tasks/steamBroadcast.type.ts'

const MESSAGE_DELAY_MIN_MS = 10000
const MESSAGE_DELAY_MAX_MS = 20000
const USER_DELAY_MS = 75

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

  return t('steam.update.summary', {
    before: totalBefore,
    after: totalAfter,
    added,
    changed,
    removed,
  })
}

function buildTopDealMessage(results: UpdateResult[]): string | null {
  const allNew = results.flatMap((r) => r.diff.added)

  if (allNew.length === 0) {
    const allChanged = results.flatMap((r) => r.diff.changed).map((c) => ({ name: '', discount_percent: c.new_discount }))

    if (allChanged.length === 0) return null

    const top = allChanged.sort((a, b) => b.discount_percent - a.discount_percent)[0]
    return t('steam.update.topDealChanged', {
      discount: top.discount_percent,
    })
  }

  const top = allNew.sort((a, b) => b.discount_percent - a.discount_percent)[0]
  return t('steam.update.topDeal', {
    name: top.name,
    discount: top.discount_percent,
  })
}

function buildRemovedMessage(results: UpdateResult[]): string | null {
  const removed = results.flatMap((r) => r.diff.removed)
  if (removed.length === 0) return null

  return t('steam.update.removed', { count: removed.length })
}

async function sendUserMessages(bot: Bot, userId: number, results: UpdateResult[]): Promise<boolean> {
  const messages: string[] = []

  messages.push(buildSummaryMessage(results))

  const topDeal = buildTopDealMessage(results)
  if (topDeal) messages.push(topDeal)

  const removed = buildRemovedMessage(results)
  if (removed) messages.push(removed)

  try {
    for (let i = 0; i < messages.length; i++) {
      await bot.api.sendMessage(userId, messages[i], { parse_mode: 'HTML' })

      if (i < messages.length - 1) {
        await sleep(randomDelay())
      }
    }

    return true
  } catch (err) {
    console.error(`Failed to notify user ${userId}:`, err)
    return false
  }
}

export async function broadcastSteamUpdate(bot: Bot, results: UpdateResult[]): Promise<BroadcastResult> {
  const pending = getPendingSteamChanges()
  const result: BroadcastResult = { sent: 0, failed: 0, skipped: 0 }

  if (pending.length === 0) {
    return result
  }

  const userIds = getUserIdsForChannel('steam')

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

  return result
}
