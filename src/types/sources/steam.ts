export interface SteamFeaturedItem {
  id: number
  name: string
  discounted: boolean
  discount_percent: number
  original_price: number | null
  final_price: number
  currency: string
  header_image: string
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