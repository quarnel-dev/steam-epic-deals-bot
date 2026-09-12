import { createDatabase } from './db.ts'

import type { Currency, Language, UserSettings } from '#types/settings/settings.type.ts'

const db = createDatabase('./data/users.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    language TEXT NOT NULL DEFAULT 'en',
    currency TEXT NOT NULL DEFAULT 'USD',
    epic_notifications INTEGER NOT NULL DEFAULT 1,
    steam_notifications INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`)

const selectUser = db.prepare('SELECT * FROM user_settings WHERE user_id = ?')
const insertUser = db.prepare('INSERT OR IGNORE INTO user_settings (user_id, language) VALUES (?, ?)')
const updateLanguage = db.prepare('UPDATE user_settings SET language = ?, updated_at = unixepoch() WHERE user_id = ?')
const updateCurrency = db.prepare('UPDATE user_settings SET currency = ?, updated_at = unixepoch() WHERE user_id = ?')
const updateEpicNotifications = db.prepare(
  'UPDATE user_settings SET epic_notifications = ?, updated_at = unixepoch() WHERE user_id = ?'
)
const updateSteamNotifications = db.prepare(
  'UPDATE user_settings SET steam_notifications = ?, updated_at = unixepoch() WHERE user_id = ?'
)
const selectSteamSubscribers = db.prepare('SELECT user_id FROM user_settings WHERE steam_notifications = 1')
const selectEpicSubscribers = db.prepare('SELECT user_id FROM user_settings WHERE epic_notifications = 1')

export function getUserSettings(userId: number, initialLanguage: Language = 'en'): UserSettings {
  const existing = selectUser.get(userId) as UserSettings | undefined
  if (existing) return existing

  insertUser.run(userId, initialLanguage)
  return selectUser.get(userId) as UserSettings
}

export function setLanguage(userId: number, language: Language): void {
  updateLanguage.run(language, userId)
}

export function setCurrency(userId: number, currency: Currency): void {
  updateCurrency.run(currency, userId)
}

export function setNotification(userId: number, channel: 'epic' | 'steam', enabled: boolean): void {
  const stmt = channel === 'epic' ? updateEpicNotifications : updateSteamNotifications
  stmt.run(enabled ? 1 : 0, userId)
}

export function getUserIdsForChannel(channel: 'epic' | 'steam'): number[] {
  const stmt = channel === 'epic' ? selectEpicSubscribers : selectSteamSubscribers
  const rows = stmt.all() as { user_id: number }[]

  return rows.map((r) => r.user_id)
}
