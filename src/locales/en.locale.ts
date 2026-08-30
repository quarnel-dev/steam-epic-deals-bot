import type { Locale } from '#types/locales/locale.type.ts'

export const en = {
  start: {
    welcome: '👋 <b>Welcome to Games Deals Bot!</b>',
    description:
      'I am your personal assistant for tracking the best game deals, discounts, and free giveaways across Steam and Epic Games Store.',
    instruction: '👇 <b>Use the menu buttons below to get started:</b>',
  },
  menu: {
    title: '🎮 <b>Main Menu</b>',
    description: 'Select a category to browse deals or configure your preferences:',
    buttons: {
      steam: '🎮 Steam Deals',
      epic: '🎁 Epic Free Games',
      settings: '⚙️ Settings',
      back: '🔙 Back',
    },
  },
  deals: {
    loading: '🔎 Fetching Steam deals...',
    empty: '🔥 No active Steam deals at the moment.',
    header: '🔥 Current Steam Deals:',
    discount: 'Discount',
    price: 'Price',
    error: '❌ Failed to fetch deals. Please try again later.',
  },
} satisfies Locale
