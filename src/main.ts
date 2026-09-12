import { createBot } from '#core/bot.core.ts'
import { startCronJobs } from './cron.ts'
import { config } from './config.ts'

import { logger } from '#logger/index.ts'

async function main() {
  logger.info('starting server...', { module: 'main' })

  const bot = createBot(config.botToken)

  await bot.init()
  logger.info(`@${bot.botInfo.username} initialized`, { module: 'bot' })

  startCronJobs(bot)

  await bot.start({
    onStart: (botInfo) => {
      logger.info(`@${botInfo.username} polling started`, { module: 'bot' })
    },
  })
}

main().catch((err) => {
  logger.error('fatal error: ', { module: 'main', err })
  process.exit(1)
})
