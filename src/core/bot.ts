import { Bot } from 'grammy'
import { startCommand } from './commands/start.ts'
import { dealsCommand } from './commands/deals.ts'
import { menuCommand } from './commands/menu.ts'

export function createBot(token: string) {
  const bot = new Bot(token)

  bot.command('start', startCommand)
  bot.command('deals', dealsCommand)
  bot.command('menu', menuCommand)

  return bot
}
