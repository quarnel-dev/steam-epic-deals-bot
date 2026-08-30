export interface Locale {
  start: {
    welcome: string
  }
}

type DotPaths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`
    }[keyof T & string]

export type LocalKey = DotPaths<Locale>
