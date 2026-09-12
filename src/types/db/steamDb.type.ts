export interface SteamDealRow {
  app_id: number
  cc: string
  lang: string
  name: string
  discount_percent: number
  original_price: number | null
  final_price: number
  currency: string
  header_image: string
  discount_expiration: number | null
  updated_at: number
}

export interface SteamAppDetailsRow {
  app_id: number
  cc: string
  lang: string
  short_description: string | null
  developers: string | null
  genres: string | null
  metacritic_score: number | null
  recommendations_total: number | null
  platforms_windows: 0 | 1
  platforms_mac: 0 | 1
  platforms_linux: 0 | 1
  updated_at: number
}

export interface SteamDealChangeRow {
  id: number
  app_id: number
  cc: string
  kind: 'added' | 'changed' | 'removed'
  old_discount: number | null
  new_discount: number | null
  detected_at: number
  notified: 0 | 1
}
export interface DealsDiff {
  added: SteamDealRow[]
  changed: Array<{ app_id: number; old_discount: number; new_discount: number }>
  removed: number[]
}
