# Plan: US-00g — Telegram Bot Shell

## Overview

Set up the grammY bot with `/start` and `/status` commands. After this step, the bot is live on Telegram and can echo live prices from the WebSocket feeds.

## Prerequisites

- US-00a (Project Init) complete — config with bot token
- US-00f (Price Bus) complete — live price data available

## Steps

### 1. `src/bot/index.ts`

- Create grammY `Bot` instance with `config.TELEGRAM_BOT_TOKEN`
- Accept price-bus as a dependency
- Register `/start` command → welcome message with brief usage instructions
- Register `/status` command → query price-bus for last BTC price from Binance and Bybit, show process uptime
- Start bot with long polling
- Export: `startBot(priceBus: PriceBus): Promise<void>`

### 2. Wire bot into `src/index.ts`

- After starting feeds, start bot with price-bus reference
- Handle SIGTERM/SIGINT for graceful shutdown: close WS connections, stop bot polling
- Log startup complete with bot username

## Files Created/Modified

```
New:
  src/bot/index.ts

Modified:
  src/index.ts  (start bot, graceful shutdown)
```

## Verify

1. `npm run dev` → bot starts, logs show bot username
2. `/start` in Telegram → welcome message
3. `/status` in Telegram → uptime + last BTC price from both Binance and Bybit
4. CTRL+C → graceful shutdown logged, bot stops cleanly
