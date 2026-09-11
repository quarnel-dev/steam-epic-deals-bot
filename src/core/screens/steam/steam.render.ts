import type { Context } from 'grammy'
import { InputMediaBuilder } from 'grammy'

import type { SteamFilter } from '#types/sources/steam.type.ts'

import { fetchSteamDeals } from '#sources/steam.source.ts'
import { formatSteamDealCard } from '#core/components/steam.component.ts'
import { t } from '#locales/index.ts'
import { getSteamKeyboard, getSteamPaginationKeyboard } from './steam.keyboard.ts'

const STEAM_FALLBACK_IMAGE = 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016'

export async function renderSteamMenu(ctx: Context) {
  const text = `${t('steam.title')}\n\n${t('steam.description')}`
  const keyboard = getSteamKeyboard()

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

export async function renderSteamCard(ctx: Context, filter: SteamFilter = 'top', pageIndex: number = 0) {
  try {
    let deals = await fetchSteamDeals()

    if (filter === 'd50') deals = deals.filter((d) => d.discount_percent >= 50)
    if (filter === 'd75') deals = deals.filter((d) => d.discount_percent >= 75)
    if (filter === 'd90') deals = deals.filter((d) => d.discount_percent >= 90)

    if (deals.length === 0) {
      await ctx.editMessageText(t('deals.empty'), {
        reply_markup: getSteamKeyboard(),
      })
      return
    }

    const currentDeal = deals[pageIndex] ?? deals[0]
    const caption = formatSteamDealCard(currentDeal)
    const gameUrl = `https://store.steampowered.com/app/${currentDeal.id}`
    const replyMarkup = getSteamPaginationKeyboard(filter, pageIndex, deals.length, gameUrl)

    const imageUrl = currentDeal.header_image || STEAM_FALLBACK_IMAGE

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
    console.error('Error rendering Steam card:', err)
    await ctx.reply(t('deals.error'), {
      reply_markup: getSteamKeyboard(),
    })
  }
}
