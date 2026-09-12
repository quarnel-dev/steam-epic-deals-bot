import type { Locale } from '#types/locales/locale.type.ts'

export const ru = {
  start: {
    welcome: '👋 <b>Добро пожаловать в Games Deals Bot!</b>',
    description:
      'Я — ваш помощник по отслеживанию лучших игровых скидок, распродаж и бесплатных раздач в Steam и Epic Games Store.',
    instruction: '👇 <b>Используйте кнопки меню ниже, чтобы начать:</b>',
  },
  menu: {
    title: '🎮 <b>Главное меню</b>',
    description: 'Выберите категорию для просмотра скидок или настройте предпочтения:',
    buttons: {
      steam: '🎮 Скидки Steam',
      epic: '🎁 Бесплатные игры Epic',
      settings: '⚙️ Настройки',
    },
  },
  buttons: {
    back: '🔙 Назад',
    refresh: '🔄 Обновить',
  },
  steam: {
    title: '🎮 <b>Меню скидок Steam</b>',
    description: 'Выберите, как фильтровать активные скидки Steam:',
    buttons: {
      top: '🔥 Лучшие скидки',
      discount50: '💥 Скидки 50%+',
      discount75: '⚡ Скидки 75%+',
      discount90: '🚀 Скидки 90%+',
      open: '🔗 Открыть в Steam',
    },
    deal: {
      title: '🎮 <b>{name}</b>',
      discount: '🔥 <b>−{percent}%</b>',
      priceFrom: '💸 <s>{original}</s> → <b>{final}</b>',
      priceOnly: '💵 Цена: <b>{price}</b>',
      savings: '💰 Экономия: <b>{amount}</b>',
      genres: '🏷 {genres}',
      developers: '👨‍💻 {developers}',
      metacritic: '⭐ {score}/100',
      recommendations: '👍 {count}',
      platforms: '💻 {platforms}',
      ends: '⏰ До: <b>{date}</b>',
      platformsWindows: 'Windows',
      platformsMac: 'macOS',
      platformsLinux: 'Linux',
    },
    update: {
      summary:
        '🔄 <b>Скидки Steam обновлены</b>\n\nБыло: {before}\nСтало: {after}\n\n🆕 Новых: {added}\n📉 Изменилось: {changed}\n🗑 Ушло: {removed}',
      removed: '🗑 {count} скидок больше не действуют',
    },
  },
  settings: {
    title: '⚙️ <b>Настройки</b>',
    description: 'Настройте язык, валюту и уведомления:',
    labels: {
      language: 'Язык',
      currency: 'Валюта',
      epicNotifications: 'Бесплатные игры Epic',
      steamNotifications: 'Скидки Steam',
    },
    values: {
      on: 'Вкл',
      off: 'Выкл',
    },
    buttons: {
      language: '🌐 Язык',
      currency: '💱 Валюта',
      epicNotifications: '🎁 Уведомления Epic',
      steamNotifications: '🎮 Уведомления Steam',
    },
  },
  deals: {
    loading: '🔎 Загружаем скидки Steam...',
    empty: '🔥 Сейчас активных скидок Steam нет.',
    header: '🔥 Актуальные скидки Steam:',
    discount: 'Скидка',
    price: 'Цена',
    error: '❌ Не удалось загрузить скидки. Попробуйте позже.',
  },
} satisfies Locale
