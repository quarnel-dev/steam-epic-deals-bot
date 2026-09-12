import type { Context } from 'grammy'

import type { TFn } from '#locales/index.ts'
import type { UserSettings } from '#types/settings/settings.type.ts'

export interface AppFlavor {
  t: TFn
  settings: UserSettings
}

export type AppContext = Context & AppFlavor