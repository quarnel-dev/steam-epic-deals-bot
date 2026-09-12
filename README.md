# Steam & Epic Deals Bot

[Read in Russian](README.ru.md) | English

Telegram bot for tracking Steam discounts and Epic Games free giveaways. Steam is live, Epic is coming soon.

Built with TypeScript, grammY, and SQLite.

## Features

- **Steam Deals:** Top discounts and filters (50%+ / 75%+ / 90%+), paginated cards.
- **Localization:** English and Russian, auto-detected from Telegram on first launch.
- **Multi-currency:** USD, EUR, RUB, UAH, KZT.
- **Notifications:** Daily Steam update broadcast at 12:00 UTC, per-user opt-in.
- **Cache:** SQLite stores deals, details, and change history — no API calls on render.
- **Logging:** Structured JSON logs via pino.

## Quick Start

```bash
npm install
cp .env.example .env
# set BOT_TOKEN in .env
npm run dev
```

## Scripts

- `npm start` — Production server
- `npm run dev` — Development server with watch mode

## Environment

| Variable               | Default      | Description                                                  |
| :--------------------- | :----------- | :----------------------------------------------------------- |
| `BOT_TOKEN`            | -            | Telegram bot token from [@BotFather](https://t.me/BotFather) |
| `CRON_SCHEDULE`        | `0 12 * * *` | Daily update schedule (UTC)                                  |
| `LOG_LEVEL`            | `info`       | `debug` / `info` / `warn` / `error`                          |
| `PRIME_CACHE_ON_START` | `true`       | Fetch deals on startup                                       |

## Commands

| Command  | Description                       |
| :------- | :-------------------------------- |
| `/start` | Initialize bot and show main menu |
| `/menu`  | Open the main menu                |

## Architecture

The codebase is split into layers to keep API clients, database, and bot UI separate:

- **`sources/`** — only place that talks to external APIs. No other layer makes HTTP calls.
- **`db/`** — SQLite stores, one file per domain (`users.db.ts`, `steam.db.ts`).
- **`tasks/`** — cron jobs. `updateSteamDeals` fetches fresh data into SQLite, `broadcastSteamUpdate` notifies subscribers.
- **`core/`** — bot logic: handlers, screens, keyboards. Reads from `db/`, never calls APIs directly.
- **`locales/`** — `en` / `ru` dictionaries, selected per user via `AppContext`.
- **`types/`** — shared TypeScript types, mirrors `src/` structure.

*Made with ❤️ by Quarnel*