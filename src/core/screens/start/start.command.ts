import type { Context } from 'grammy'

import { renderStart } from './start.render.ts'

export async function startCommand(ctx: Context) {
  renderStart(ctx)
}
