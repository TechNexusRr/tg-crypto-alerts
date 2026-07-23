# tg-crypto-alerts

Telegram bot that monitors crypto prices in real-time via the Binance WebSocket feed and sends configurable movement alerts.

## Features

- **Price Movement Alerts** — get notified when a symbol moves by a fixed dollar amount (e.g. `/alert ETH 10`). Re-anchors after each trigger so you stay informed on continued moves.
- **Price Feed** — Binance spot public data stream (`data-stream.binance.vision`), 21 crypto symbols
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

Currently hardcoded to 21 Binance spot pairs:

BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK, DOT, TRX, TON, LTC, BCH, NEAR, ATOM, UNI, APT, ARB, OP, RIF

### Feed endpoint & the TradFi limitation

The feed connects to Binance's **public spot data domain**, `data-stream.binance.vision`, rather than `fstream.binance.com` (futures) or `stream.binance.com` (spot main). On this deployment's host, Binance's main and futures WebSockets reject the connection at the handshake (non-101 status) — an IP/geo block on datacenter ranges — while the public data domain stays reachable.

Because that domain serves **spot** only, Binance's TradFi perpetuals (gold `XAUUSDT`, silver `XAGUSDT`, Tesla `TSLAUSDT`, Nvidia `NVDAUSDT`) are **not available** here — they exist only as `TRADIFI_PERPETUAL` futures contracts. They're left commented out in `src/feeds/symbols.ts`; re-enable them only if the host can reach Binance futures again (e.g. via a proxy/VPN egress).
