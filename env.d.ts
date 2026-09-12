declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      CRON_SCHEDULE?: string
      LOG_LEVEL?: string
      PRIME_CACHE_ON_START?: string
    }
  }
}

export {};
