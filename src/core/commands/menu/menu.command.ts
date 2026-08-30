import { Context } from 'grammy'

import { renderMenu } from './menu.render.ts'

export async function menuCommand(ctx: Context) {
  await renderMenu(ctx)
}
