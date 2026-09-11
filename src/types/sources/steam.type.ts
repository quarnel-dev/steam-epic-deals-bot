export interface SteamFeaturedItem {
  id: number
  name: string
  discounted: boolean
  discount_percent: number
  original_price: number | null
  final_price: number
  currency: string
  header_image: string
  small_capsule_image?: string
  large_capsule_image?: string
  discount_expiration?: number
}

export interface SteamFeaturedCategory {
  id: string
  name: string
  items?: SteamFeaturedItem[]
}

export interface SteamFeaturedCategoriesResponse {
  specials?: SteamFeaturedCategory
  status: number
}

export type SteamFilter = 'top' | 'd50' | 'd75' | 'd90'
