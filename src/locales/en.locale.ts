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
    },
  },
  buttons: {
    back: '🔙 Back',
    refresh: '🔄 Refresh',
  },
  steam: {
    title: '🎮 <b>Steam Deals Menu</b>',
    description: 'Choose how you want to filter active Steam deals:',
    buttons: {
      top: '🔥 Top Deals',
      discount50: '💥 50%+ Off',
      discount75: '⚡ 75%+ Off',
      discount90: '🚀 90%+ Off',
      open: '🔗 Open in Steam',
    },
    deal: {
      title: '🎮 <b>{name}</b>',
      discount: '🔥 <b>−{percent}%</b>',
      priceFrom: '💸 <s>{original}</s> → <b>{final}</b>',
      priceOnly: '💵 Price: <b>{price}</b>',
      savings: '💰 Savings: <b>{amount}</b>',
      genres: '🏷 {genres}',
      developers: '👨‍💻 {developers}',
      metacritic: '⭐ {score}/100',
      recommendations: '👍 {count}',
      platforms: '💻 {platforms}',
      ends: '⏰ Ends: <b>{date}</b>',
      platformsWindows: 'Windows',
      platformsMac: 'macOS',
      platformsLinux: 'Linux',
    },
  },
  settings: {
    title: '⚙️ <b>Settings</b>',
    description: 'Configure your language, currency, and notifications:',
    labels: {
      language: 'Language',
      currency: 'Currency',
      epicNotifications: 'Epic free games',
      steamNotifications: 'Steam deals',
    },
    values: {
      on: 'On',
      off: 'Off',
    },
    buttons: {
      language: '🌐 Language',
      currency: '💱 Currency',
      epicNotifications: '🎁 Epic notifications',
      steamNotifications: '🎮 Steam notifications',
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
