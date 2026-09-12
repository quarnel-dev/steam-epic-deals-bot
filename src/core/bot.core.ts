import { Bot } from 'grammy'
import { startCommand } from './screens/start/start.command.ts'
import { menuCommand } from './screens/menu/menu.command.ts'
import { handleMenuCallback } from './handlers/menu.handler.ts'
import { handleSteamCallback } from './handlers/steam.handler.ts'
import { handleSettingsCallback } from './handlers/settings.handler.ts'
import { ensureUser } from './middlewares/ensureUser.middleware.ts'

export function createBot(token: string) {
  const bot = new Bot(token)

  bot.catch((err) => {
    const ctx = err.ctx
    console.error(`Error while handling update ${ctx.update.update_id}: `, err.error)
  })

  bot.use(ensureUser)

  bot.command('start', startCommand)
  bot.command('menu', menuCommand)

  bot.callbackQuery(/^menu_/, handleMenuCallback)
  bot.callbackQuery(/^steam_/, handleSteamCallback)
  bot.callbackQuery(/^settings_/, handleSettingsCallback)

  return bot
}
