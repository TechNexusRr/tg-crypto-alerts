# tg-crypto-alerts

Telegram bot that monitors crypto prices in real-time via Binance and Bybit WebSocket feeds and sends configurable movement alerts.

## Features

- **Price Movement Alerts** — get notified when a symbol moves by a fixed dollar amount (e.g. `/alert ETH 10`). Re-anchors after each trigger so you stay informed on continued moves.
- **Dual Price Feeds** — Binance USDT-M Futures + Bybit v5 Linear perpetuals, 10 symbols
- **Alert Management** — list, edit, and drop alerts (`/list`, `/edit`, `/drop`)
- **Symbol Search** — find available trading pairs (`/symbols btc`)
- **System Health** — check feed status, uptime, and prices (`/status`)
- **Audit Trail** — every create, edit, trigger, and drop is recorded with full snapshots

## Commands

| Command | Example | Description |
|---|---|---|
| `/start` | `/start` | Register + welcome |
| `/alert` | `/alert ETH 10` | Movement alert ($10 move from current price) |
| `/edit` | `/edit 3 15` | Edit alert #3 to $15 move, resets anchor |
| `/drop` | `/drop 3` or `/drop all` | Remove alert(s) |
| `/list` | `/list` | Show active alerts |
| `/symbols` | `/symbols btc` | Search available symbols |
| `/status` | `/status` | System health |

## Tech Stack

- **Runtime**: Node.js 22 LTS (native TS via `--experimental-strip-types`, native WebSocket, `--env-file`)
- **Telegram**: grammY
- **Database**: SQLite (better-sqlite3 + drizzle-orm)
- **Logging**: pino (structured JSON)
- **Config**: zod validation

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your bot token and chat ID

# Run in development (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Yes | Your Telegram chat ID |
| `DB_PATH` | No | SQLite path (default: `./data/alerts.db`) |
| `LOG_LEVEL` | No | pino log level (default: `info`) |

## Tracked Symbols

Currently hardcoded to 10 USDT perpetual pairs:

BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK, PEPE
