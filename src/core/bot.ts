import { Bot } from 'grammy'
import { startCommand } from './commands/start.ts'
import { dealsCommand } from './commands/deals.ts'

export function createBot(token: string) {
  const bot = new Bot(token)

  bot.command('start', startCommand)
  bot.command('deals', dealsCommand)

  return bot
}
