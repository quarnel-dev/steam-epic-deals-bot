import type { AppContext } from '#types/context.type.ts'
import { InputMediaBuilder } from 'grammy'

import { logger } from '#logger/index.ts'

import { componentSteamDealCard } from '#core/components/steam.component.ts'
import { getSteamKeyboard, getSteamPaginationKeyboard } from './steam.keyboard.ts'

import { getUserSettings } from '#db/users.db.ts'
import { getSteamAppDetails, getSteamDealsAsFeatured } from '#db/steam.db.ts'
import { CURRENCY_TO_CC } from '#types/settings/settings.type.ts'

import type { SteamFilter } from '#types/sources/steam.type.ts'

const STEAM_FALLBACK_IMAGE = 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016'

export async function renderSteamMenu(ctx: AppContext) {
  const text = `${ctx.t('steam.title')}\n\n${ctx.t('steam.description')}`
  const keyboard = getSteamKeyboard(ctx.t)

  if (ctx.callbackQuery) {
    if (ctx.callbackQuery.message?.photo) {
      await ctx.deleteMessage().catch(() => {})
      await ctx.reply(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      })
    } else {
      await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      })
    }
  } else {
    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    })
  }
}

export async function renderSteamCard(ctx: AppContext, filter: SteamFilter = 'top', pageIndex: number = 0) {
  try {
    const userId = ctx.from!.id
    const settings = getUserSettings(userId)
    const cc = CURRENCY_TO_CC[settings.currency]

    let deals = getSteamDealsAsFeatured(cc)

    if (filter === 'd50') deals = deals.filter((d) => d.discount_percent >= 50)
    if (filter === 'd75') deals = deals.filter((d) => d.discount_percent >= 75)
    if (filter === 'd90') deals = deals.filter((d) => d.discount_percent >= 90)

    if (deals.length === 0) {
      logger.debug('no deals to render', { module: 'steam.render', userId, cc, filter })
      await ctx.editMessageText(ctx.t('deals.empty'), {
        reply_markup: getSteamKeyboard(ctx.t),
      })
      return
    }

    const currentDeal = deals[pageIndex] ?? deals[0]
    const details = getSteamAppDetails(currentDeal.id, cc)

    const caption = componentSteamDealCard(currentDeal, details)
    const gameUrl = `https://store.steampowered.com/app/${currentDeal.id}`
    const replyMarkup = getSteamPaginationKeyboard(ctx.t, filter, pageIndex, deals.length, gameUrl)

    const imageUrl = currentDeal.header_image || STEAM_FALLBACK_IMAGE

    logger.debug('rendering steam card', {
      module: 'steam.render',
      userId,
      cc,
      filter,
      appId: currentDeal.id,
      page: `${pageIndex + 1}/${deals.length}`,
      hasDetails: Boolean(details),
    })

    if (ctx.callbackQuery?.message?.photo) {
      await ctx.editMessageMedia(
        InputMediaBuilder.photo(imageUrl, {
          caption,
          parse_mode: 'HTML',
        }),
        { reply_markup: replyMarkup }
      )
    } else {
      if (ctx.callbackQuery) {
        await ctx.deleteMessage().catch(() => {})
      }
      await ctx.replyWithPhoto(imageUrl, {
        caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      })
    }
  } catch (err) {
    logger.error('failed to render steam card', { module: 'steam.render', err })
    await ctx.reply(ctx.t('deals.error'), {
      reply_markup: getSteamKeyboard(ctx.t),
    })
  }
}
