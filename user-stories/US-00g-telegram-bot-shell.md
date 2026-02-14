# US-00g: Telegram Bot Shell

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Set up the grammY Telegram bot with `/start` and `/status` commands. Wire it into the entry point with graceful shutdown. After this, the bot is live and can echo live prices.

## Plan

See: `plans/00g-telegram-bot-shell.md`

## Depends On

- US-00a (Project Init) — config with bot token
- US-00f (Price Bus) — live price data available

## Acceptance Criteria

- [x] `bot/index.ts` — grammY bot with `config.TELEGRAM_BOT_TOKEN`
- [x] `/start` command → welcome message with brief usage instructions
- [x] `/status` command → process uptime + last BTC price from Binance and Bybit (per source via `getLastPriceBySource`)
- [x] Bot starts with long polling
- [x] `index.ts` wires everything: feeds → bus → bot
- [x] SIGTERM/SIGINT graceful shutdown: close WS connections, stop bot polling

## Verify

1. `npm run dev` → bot starts, logs show bot username (`TheDominicanAlerterBot`) ✅
2. `/start` in Telegram → welcome message ✅
3. `/status` in Telegram → uptime + last BTC price from both sources ✅
4. CTRL+C → graceful shutdown logged, bot stops cleanly ✅
