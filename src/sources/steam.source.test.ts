import { test, expect, vi, afterEach } from 'vitest'
import { fetchSteamDeals } from './steam.source.ts'

afterEach(() => {
  vi.restoreAllMocks()
})

test('fetchSteamDeals returns only discounted items', async () => {
  const mockResponse = {
    specials: {
      id: 'cat_specials',
      name: 'Specials',
      items: [
        {
          id: 1,
          name: 'Discounted Game',
          discounted: true,
          discount_percent: 50,
          original_price: 1000,
          final_price: 500,
          currency: 'EUR',
          header_image: 'url1',
        },
        {
          id: 2,
          name: 'Full Price Game',
          discounted: false,
          discount_percent: 0,
          original_price: 1000,
          final_price: 1000,
          currency: 'EUR',
          header_image: 'url2',
        },
      ],
    },
    status: 1,
  }

  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }))

  const deals = await fetchSteamDeals()

  expect(deals).toHaveLength(1)
  expect(deals[0].name).toBe('Discounted Game')
})

test('fetchSteamDeals throws on non-ok response', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 500 }))

  await expect(fetchSteamDeals()).rejects.toThrow(/Steam API request failed/)
})
