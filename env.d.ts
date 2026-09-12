declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      CRON_SCHEDULE?: string
      LOG_LEVEL?: string
    }
  }
}

export {};
