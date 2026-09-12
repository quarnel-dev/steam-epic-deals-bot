import type { AppContext } from '#types/context.type.ts'

import { renderStart } from './start.render.ts'

export async function startCommand(ctx: AppContext) {
  renderStart(ctx)
}
