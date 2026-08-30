function getEnv(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key]

  if (!value) throw new Error(`Missing required env variable: ${key}`)

  return value
}

export const config = {
  botToken: getEnv('BOT_TOKEN'),
} as const
