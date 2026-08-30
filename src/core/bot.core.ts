import { Bot } from 'grammy'
import { startCommand } from './screens/start/start.command.ts'
import { menuCommand } from './screens/menu/menu.command.ts'
import { handleMenuCallback } from './handlers/menu.handler.ts'

export function createBot(token: string) {
  const bot = new Bot(token)

  bot.command('start', startCommand)
  bot.command('menu', menuCommand)

  bot.callbackQuery(/^menu_/, handleMenuCallback)

  return bot
}
