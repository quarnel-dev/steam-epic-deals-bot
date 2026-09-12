import { createBot } from '#core/bot.core.ts'
import { startCronJobs } from './cron.ts'
import { config } from './config.ts'

console.log('[ main ] starting server...')
const bot = createBot(config.botToken)

startCronJobs(bot)

bot.start()
console.log('[ bot ] bot started')
