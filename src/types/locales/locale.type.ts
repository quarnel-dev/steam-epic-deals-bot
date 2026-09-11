export interface Locale {
  start: {
    welcome: string
    description: string
    instruction: string
  }
  menu: {
    title: string
    description: string
    buttons: {
      steam: string
      epic: string
      settings: string
    }
  }
  buttons: {
    back: string
    refresh: string
  }
  steam: {
    title: string
    description: string
    buttons: {
      top: string
      discount50: string
      discount75: string
      discount90: string
      open: string
    }
    deal: {
      title: string
      discount: string
      priceFrom: string
      priceOnly: string
      savings: string
      genres: string
      developers: string
      metacritic: string
      recommendations: string
      platforms: string
      ends: string
      platformsWindows: string
      platformsMac: string
      platformsLinux: string
    }
  }
  settings: {
    title: string
    description: string
    labels: {
      language: string
      currency: string
      epicNotifications: string
      steamNotifications: string
    }
    values: {
      on: string
      off: string
    }
    buttons: {
      language: string
      currency: string
      epicNotifications: string
      steamNotifications: string
    }
  }
  deals: {
    loading: string
    empty: string
    header: string
    discount: string
    price: string
    error: string
  }
}

type DotPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`
    }[keyof T & string]

export type LocalKey = DotPaths<Locale>
