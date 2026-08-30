import type { Locale } from '#types/locales/locale.ts'

export const en = {
  start: {
    welcome: 'Hello! Welcome to Steam & Epic Games Deals Bot.',
  },
  deals: {
    loading: '🔎 Fetching Steam deals...',
    empty: '🔥 No active Steam deals at the moment.',
    header: '🔥 Current Steam Deals:  ',
    discount: 'Discount',
    price: 'Price',
    error: '❌ Failed to fetch deals. Please try again later.',
  },
} satisfies Locale