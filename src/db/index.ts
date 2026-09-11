import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import Database from 'better-sqlite3'

import type { Currency, Language, UserSettings } from '#types/settings/settings.type.ts'

const DB_PATH = './data/bot.db'

mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

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

export function getUserSettings(userId: number): UserSettings {
  const existing = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId) as UserSettings | undefined

  if (existing) return existing

  db.prepare('INSERT INTO user_settings (user_id) VALUES (?)').run(userId)

  return db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId) as UserSettings
}

export function setLanguage(userId: number, language: Language) {
  db.prepare('UPDATE user_settings SET language = ?, updated_at = unixepoch() WHERE user_id = ?').run(language, userId)
}

export function setCurrency(userId: number, currency: Currency) {
  db.prepare('UPDATE user_settings SET currency = ?, updated_at = unixepoch() WHERE user_id = ?').run(currency, userId)
}

export function setNotification(userId: number, channel: 'epic' | 'steam', enabled: boolean) {
  const column = channel === 'epic' ? 'epic_notifications' : 'steam_notifications'
  db.prepare(`UPDATE user_settings SET ${column} = ?, updated_at = unixepoch() WHERE user_id = ?`).run(enabled ? 1 : 0, userId)
}
