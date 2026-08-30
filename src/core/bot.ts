import { Bot } from 'grammy'
import { startCommand } from './commands/start.ts'

export function createBot(token: string) {
  const bot = new Bot(token)

  bot.command('start', startCommand)

  return bot
}
