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
      back: string
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
