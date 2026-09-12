import { createDatabase } from './db.ts'

import type { SteamAppDetails, SteamFeaturedItem } from '#types/sources/steam.type.ts'
import type { SteamDealRow, SteamAppDetailsRow, SteamDealChangeRow, DealsDiff } from '#types/db/steamDb.type.ts'

const db = createDatabase('./data/steam.db')

db.exec(`
  DROP TABLE IF EXISTS steam_deals;
  DROP TABLE IF EXISTS steam_app_details;

  CREATE TABLE IF NOT EXISTS steam_deals (
    app_id INTEGER NOT NULL,
    cc TEXT NOT NULL,
    lang TEXT NOT NULL,
    name TEXT NOT NULL,
    discount_percent INTEGER NOT NULL,
    original_price INTEGER,
    final_price INTEGER NOT NULL,
    currency TEXT NOT NULL,
    header_image TEXT NOT NULL,
    discount_expiration INTEGER,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY (app_id, cc, lang)
  );

  CREATE TABLE IF NOT EXISTS steam_app_details (
    app_id INTEGER NOT NULL,
    cc TEXT NOT NULL,
    lang TEXT NOT NULL,
    short_description TEXT,
    developers TEXT,
    genres TEXT,
    metacritic_score INTEGER,
    recommendations_total INTEGER,
    platforms_windows INTEGER NOT NULL DEFAULT 0,
    platforms_mac INTEGER NOT NULL DEFAULT 0,
    platforms_linux INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY (app_id, cc, lang)
  );

  CREATE TABLE IF NOT EXISTS steam_deal_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id INTEGER NOT NULL,
    cc TEXT NOT NULL,
    kind TEXT NOT NULL,
    old_discount INTEGER,
    new_discount INTEGER,
    detected_at INTEGER NOT NULL DEFAULT (unixepoch()),
    notified INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_steam_deal_changes_notified
    ON steam_deal_changes (notified, detected_at);
`)

const selectDealsByCcLang = db.prepare('SELECT * FROM steam_deals WHERE cc = ? AND lang = ? ORDER BY discount_percent DESC')
const selectDeal = db.prepare('SELECT * FROM steam_deals WHERE app_id = ? AND cc = ? AND lang = ?')
const deleteDealsByCcLang = db.prepare('DELETE FROM steam_deals WHERE cc = ? AND lang = ?')
const upsertDeal = db.prepare(`
  INSERT INTO steam_deals (app_id, cc, lang, name, discount_percent, original_price, final_price, currency, header_image, discount_expiration)
  VALUES (@app_id, @cc, @lang, @name, @discount_percent, @original_price, @final_price, @currency, @header_image, @discount_expiration)
  ON CONFLICT(app_id, cc, lang) DO UPDATE SET
    name = excluded.name,
    discount_percent = excluded.discount_percent,
    original_price = excluded.original_price,
    final_price = excluded.final_price,
    currency = excluded.currency,
    header_image = excluded.header_image,
    discount_expiration = excluded.discount_expiration,
    updated_at = unixepoch()
`)

const selectDetails = db.prepare('SELECT * FROM steam_app_details WHERE app_id = ? AND cc = ? AND lang = ?')
const upsertDetails = db.prepare(`
  INSERT INTO steam_app_details (app_id, cc, lang, short_description, developers, genres, metacritic_score, recommendations_total, platforms_windows, platforms_mac, platforms_linux)
  VALUES (@app_id, @cc, @lang, @short_description, @developers, @genres, @metacritic_score, @recommendations_total, @platforms_windows, @platforms_mac, @platforms_linux)
  ON CONFLICT(app_id, cc, lang) DO UPDATE SET
    short_description = excluded.short_description,
    developers = excluded.developers,
    genres = excluded.genres,
    metacritic_score = excluded.metacritic_score,
    recommendations_total = excluded.recommendations_total,
    platforms_windows = excluded.platforms_windows,
    platforms_mac = excluded.platforms_mac,
    platforms_linux = excluded.platforms_linux,
    updated_at = unixepoch()
`)

const insertChange = db.prepare(`
  INSERT INTO steam_deal_changes (app_id, cc, kind, old_discount, new_discount)
  VALUES (?, ?, ?, ?, ?)
`)
const selectPendingChanges = db.prepare('SELECT * FROM steam_deal_changes WHERE notified = 0 ORDER BY detected_at ASC')
const markChangesNotified = db.prepare('UPDATE steam_deal_changes SET notified = 1 WHERE id = ?')

export function getSteamDeals(cc: string, lang: string): SteamDealRow[] {
  return selectDealsByCcLang.all(cc, lang) as SteamDealRow[]
}

export function getSteamDeal(appId: number, cc: string, lang: string): SteamDealRow | undefined {
  return selectDeal.get(appId, cc, lang) as SteamDealRow | undefined
}

export function replaceSteamDeals(cc: string, lang: string, deals: SteamFeaturedItem[]): DealsDiff {
  const oldRows = getSteamDeals(cc, lang)
  const oldMap = new Map(oldRows.map((r) => [r.app_id, r]))
  const newIds = new Set(deals.map((d) => d.id))

  const diff: DealsDiff = { added: [], changed: [], removed: [] }

  const tx = db.transaction(() => {
    deleteDealsByCcLang.run(cc, lang)

    for (const deal of deals) {
      upsertDeal.run({
        app_id: deal.id,
        cc,
        lang,
        name: deal.name,
        discount_percent: deal.discount_percent,
        original_price: deal.original_price ?? null,
        final_price: deal.final_price,
        currency: deal.currency,
        header_image: deal.header_image,
        discount_expiration: deal.discount_expiration ?? null,
      })

      const old = oldMap.get(deal.id)

      if (!old) {
        diff.added.push({
          app_id: deal.id,
          cc,
          lang,
          name: deal.name,
          discount_percent: deal.discount_percent,
          original_price: deal.original_price ?? null,
          final_price: deal.final_price,
          currency: deal.currency,
          header_image: deal.header_image,
          discount_expiration: deal.discount_expiration ?? null,
          updated_at: Math.floor(Date.now() / 1000),
        })
        if (lang === 'en') insertChange.run(deal.id, cc, 'added', null, deal.discount_percent)
        continue
      }

      if (old.discount_percent !== deal.discount_percent) {
        diff.changed.push({
          app_id: deal.id,
          old_discount: old.discount_percent,
          new_discount: deal.discount_percent,
        })
        if (lang === 'en') insertChange.run(deal.id, cc, 'changed', old.discount_percent, deal.discount_percent)
      }
    }

    for (const old of oldRows) {
      if (!newIds.has(old.app_id)) {
        diff.removed.push(old.app_id)
        if (lang === 'en') insertChange.run(old.app_id, cc, 'removed', old.discount_percent, null)
      }
    }
  })

  tx()

  return diff
}

export function getSteamAppDetails(appId: number, cc: string, lang: string): SteamAppDetails | null {
  const row = selectDetails.get(appId, cc, lang) as SteamAppDetailsRow | undefined
  if (!row) return null

  return {
    appid: row.app_id,
    name: '',
    short_description: row.short_description ?? undefined,
    developers: row.developers ? (JSON.parse(row.developers) as string[]) : undefined,
    genres: row.genres ? (JSON.parse(row.genres) as string[]).map((g, i) => ({ id: String(i), description: g })) : undefined,
    metacritic: row.metacritic_score ? { score: row.metacritic_score, url: '' } : undefined,
    recommendations: row.recommendations_total ? { total: row.recommendations_total } : undefined,
    platforms: {
      windows: Boolean(row.platforms_windows),
      mac: Boolean(row.platforms_mac),
      linux: Boolean(row.platforms_linux),
    },
  }
}

export function saveSteamAppDetails(appId: number, cc: string, lang: string, details: SteamAppDetails): void {
  upsertDetails.run({
    app_id: appId,
    cc,
    lang,
    short_description: details.short_description ?? null,
    developers: details.developers ? JSON.stringify(details.developers) : null,
    genres: details.genres ? JSON.stringify(details.genres.map((g) => g.description)) : null,
    metacritic_score: details.metacritic?.score ?? null,
    recommendations_total: details.recommendations?.total ?? null,
    platforms_windows: details.platforms?.windows ? 1 : 0,
    platforms_mac: details.platforms?.mac ? 1 : 0,
    platforms_linux: details.platforms?.linux ? 1 : 0,
  })
}

export function getPendingSteamChanges(): SteamDealChangeRow[] {
  return selectPendingChanges.all() as SteamDealChangeRow[]
}

export function markSteamChangesNotified(ids: number[]): void {
  const tx = db.transaction((changeIds: number[]) => {
    for (const id of changeIds) markChangesNotified.run(id) // ← вот тут
  })
  tx(ids)
}
export function getSteamDealsAsFeatured(cc: string, lang: string): SteamFeaturedItem[] {
  return getSteamDeals(cc, lang).map((row) => ({
    id: row.app_id,
    name: row.name,
    discount_percent: row.discount_percent,
    original_price: row.original_price ?? 0,
    final_price: row.final_price,
    currency: row.currency,
    header_image: row.header_image,
    discount_expiration: row.discount_expiration ?? undefined,
    discounted: true,
  }))
}
