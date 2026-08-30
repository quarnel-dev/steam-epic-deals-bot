import { createBot } from './core/bot.ts'
import { config } from './config.ts'

const bot = createBot(config.botToken)
bot.start()
