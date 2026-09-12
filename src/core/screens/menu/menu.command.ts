import type { AppContext } from '#types/context.type.ts'

import { renderMenu } from './menu.render.ts'

export async function menuCommand(ctx: AppContext) {
  await renderMenu(ctx)
}
