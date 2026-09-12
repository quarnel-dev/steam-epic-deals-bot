export const LOG_MODULES = [
  'main',
  'bot',
  'cron',
  'steam.db',
  'users.db',
  'steam.source',
  'steamDetails.source',
  'steam.task',
  'broadcast.task',
  'settings.handler',
  'menu.handler',
  'steam.handler',
  'steam.render',
] as const

export type LogModule = (typeof LOG_MODULES)[number]

export interface LogContext {
  module: LogModule
  err?: unknown
  [key: string]: unknown
}
