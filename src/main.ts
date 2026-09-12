import { createBot } from '#core/bot.core.ts'
import { startCronJobs } from './cron.ts'
import { config } from './config.ts'

async function main() {
  console.log('[ main ] starting server...')

  const bot = createBot(config.botToken)

  await bot.init()
  console.log(`[ bot ] @${bot.botInfo.username} initialized`)

  startCronJobs(bot)

  await bot.start({
    onStart: (botInfo) => {
      console.log(`[ bot ] @${botInfo.username} polling started`)
    },
  })
}

main().catch((err) => {
  console.error('[ main ] fatal error:', err)
  process.exit(1)
})
