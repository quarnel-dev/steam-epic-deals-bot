import { createBot } from '#core/bot.core.ts'
import { config } from './config.ts'

const bot = createBot(config.botToken)
bot.start()
