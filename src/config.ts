function getEnv(key: keyof NodeJS.ProcessEnv, fallback?: string): string {
  const value = process.env[key] ?? fallback

  if (!value) throw new Error(`Missing env: ${key}`)

  return value
}

export const config = {
  botToken: getEnv('BOT_TOKEN'),
  cronSchedule: getEnv('CRON_SCHEDULE', '0 12 * * *'),
  logLevel: getEnv('LOG_LEVEL', 'info'),
  primeCacheOnStart: process.env.PRIME_CACHE_ON_START !== 'false',
} as const
