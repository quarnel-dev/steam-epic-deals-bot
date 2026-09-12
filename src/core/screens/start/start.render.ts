import type { AppContext } from '#types/context.type.ts'

import { renderMenu } from '../menu/menu.render.ts'

export async function renderStart(ctx: AppContext) {
  const text = `${ctx.t('start.welcome')}\n\n${ctx.t('start.description')}\n\n${ctx.t('start.instruction')}`

  await ctx.reply(text, {
    parse_mode: 'HTML',
  })

  await renderMenu(ctx, { editMessage: false })
}
