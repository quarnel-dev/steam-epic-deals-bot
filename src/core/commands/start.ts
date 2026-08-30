import type { Context } from 'grammy'

export function startCommand(ctx: Context) {
  return ctx.reply('Hello World')
}
