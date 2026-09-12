export const CURRENCIES = ['USD', 'EUR', 'RUB', 'UAH', 'KZT'] as const
export type Currency = (typeof CURRENCIES)[number]

export const LANGUAGES = ['en', 'ru'] as const
export type Language = (typeof LANGUAGES)[number]

export interface UserSettings {
  user_id: number
  language: Language
  currency: Currency
  epic_notifications: 0 | 1
  steam_notifications: 0 | 1
  created_at: number
  updated_at: number
}

export const CURRENCY_TO_CC: Record<Currency, string> = {
  USD: 'us',
  EUR: 'de',
  RUB: 'ru',
  UAH: 'ua',
  KZT: 'kz',
}