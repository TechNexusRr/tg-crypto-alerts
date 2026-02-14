# Telegram Crypto Alerts Bot - Implementation Plan

## Context

Build a Telegram bot from scratch that monitors crypto prices in real-time and sends configurable alerts. Start as a single-user tool, architected so multi-user SaaS can be layered on later without restructuring.

## User Stories

### Price Movement Alerts
- As a user, I want to be notified when ETH moves by \$10 from its current price, so if ETH is at \$2,000 when I create the alert, I get notified when it hits \$2,010 or \$1,990
- As a user, I want the alert to keep firing on each subsequent \$10 move (re-anchors to the trigger price), so I stay informed as the price continues to move
- As a user, I want to set different movement amounts per symbol (e.g. \$100 for BTC, \$10 for ETH)
- As a user, I want to edit an existing movement alert's amount (e.g. change from \$10 to \$15) without recreating it, and have the anchor reset to the current price
- As a user, I want to delete a specific movement alert by ID, or delete all my alerts at once
- As a user, I want to use decimal precision up to 5 places for the movement amount (e.g. `/alert PEPE 0.00001`) so I can track low-price tokens accurately

### Price Threshold Alerts _(future)_
- As a user, I want to set an alert when BTC crosses above $100,000 so I get notified the moment it happens
- As a user, I want to set an alert when ETH drops below $2,000 so I can buy the dip
- As a user, I want threshold alerts to fire once and deactivate, so I don't get spammed after the price crosses

### Percent Change Alerts _(future)_
- As a user, I want to be alerted when ETH moves 5% in the last 60 minutes so I can react to sudden volatility
- As a user, I want percent change alerts to repeat (with a cooldown) so I stay informed during extended moves

### Price Watch / Ticks _(future)_
- As a user, I want to watch BTC and receive its price every 5 minutes so I can track it passively
- As a user, I want to stop watching a symbol at any time with a single command

### Alert Management
- As a user, I want to list all my active movement alerts with their IDs, symbol, move amount, and current anchor price
- As a user, I want to drop a specific alert by ID (`/drop 3`) or drop all alerts at once (`/drop all`)
- As a user, I want to edit an existing movement alert's amount (`/edit 3 15`) and have the anchor reset to the current price, with the old values preserved in the audit trail
- As a user, I want a full history of triggered, edited, and dropped alerts so I can review what happened and when

### Symbol Discovery
- As a user, I want to search available symbols (e.g. `/symbols btc`) so I can find the exact pair name before creating an alert

### System Health
- As a user, I want to check the bot's status (uptime, active streams, last prices) to know it's running correctly

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Runtime | Node.js 22 LTS | Native TS (type stripping), native WebSocket, `--env-file`, `--watch`. No `tsx` needed. |
| Language | TypeScript | Type safety, better DX, easier SaaS evolution |
| Telegram | `grammy` | Best TS types, lighter than Telegraf, active maintenance |
| Binance data | Native `WebSocket` | USDT-M Futures combined stream (`fstream.binance.com`); 10 hardcoded symbols |
| Bybit data | Native `WebSocket` | v5 Linear perpetuals (`stream.bybit.com/v5/public/linear`); per-symbol subscription with cross-exchange symbol mapping |
| Database | `better-sqlite3` + `drizzle-orm` | Zero-ops SQLite now; swap to Postgres for SaaS by changing driver only |
| Logging | `pino` | Fast structured JSON logging |
| Config | `zod` + `--env-file` | Node 22 `--env-file=.env` replaces `dotenv`; Zod validates at startup |
| Build | `tsup` (prod), `node --watch` (dev) | Single-file production bundle; native watch + TS for dev |
| Deploy | `pm2` on Namecheap VPS | Auto-restart, log rotation, systemd startup |

## Project Structure

```
tg-crypto-alerts/
├── src/
│   ├── index.ts                 # Entry point: boots all services
│   ├── config.ts                # Zod-validated env config
│   ├── bot/
│   │   ├── index.ts             # grammY bot setup + launch
│   │   ├── commands/
│   │   │   ├── start.ts         # /start - welcome + register
│   │   │   ├── alert.ts         # /alert ETH 10 - movement alert
│   │   │   ├── edit.ts          # /edit 3 15 - edit alert amount
│   │   │   ├── drop.ts          # /drop <id|all>
│   │   │   ├── list.ts          # /list active alerts
│   │   │   ├── symbols.ts       # /symbols btc - search pairs
│   │   │   ├── status.ts        # /status system health
│   │   │   └── help.ts          # /help command ref
│   │   └── formatters.ts        # Telegram message formatting
│   ├── feeds/
│   │   ├── symbols.ts           # Watched symbols list + cross-exchange symbol mapping
│   │   ├── binance-ws.ts        # Binance USDT-M Futures WS + auto-reconnect
│   │   ├── bybit-ws.ts          # Bybit v5 Linear WS + auto-reconnect + symbol mapping
│   │   ├── types.ts             # PriceUpdate, FeedHealth interfaces
│   │   └── price-bus.ts         # EventEmitter normalizing Binance + Bybit
│   ├── engine/
│   │   ├── alert-engine.ts      # Core loop: evaluate alerts vs prices
│   │   └── movement-alert.ts    # Price moves X from anchor
│   ├── db/
│   │   ├── client.ts            # Drizzle + better-sqlite3 init
│   │   ├── schema.ts            # Table definitions
│   │   └── migrations/          # Drizzle-kit generated
│   ├── services/
│   │   ├── alert-store.ts       # Alert CRUD (DB abstraction)
│   │   ├── user-store.ts        # User CRUD
│   │   └── notifier.ts          # Rate-limited Telegram sender
│   └── utils/
│       ├── logger.ts            # Pino setup
│       ├── symbols.ts           # Symbol normalization (BTC -> BTCUSDT)
│       └── retry.ts             # Generic retry/backoff
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Data Flow

Shows how price data moves through the system — from exchange WebSockets to the user's Telegram chat. Each component is decoupled so sources, evaluation logic, and delivery can change independently.

```
Binance USDT-M Futures WS ─────┐
  (combined miniTicker stream)  ├──> price-bus (EventEmitter) ──> alert-engine ──> notifier ──> Telegram
Bybit v5 Linear WS ────────────┘     (canonical symbols,          (evaluates        (rate-limited
  (per-symbol tickers)                  PriceUpdate)                all alerts)        msg queue)
```

**Key decisions:**
- **Scoped to 10 hardcoded USDT perpetual symbols** (`feeds/symbols.ts`) — BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK, PEPE. Future: dynamically subscribe based on active alerts.
- **Binance USDT-M Futures combined stream** — connects to `fstream.binance.com/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker/...`. One WebSocket connection, one message per symbol tick. Futures (not spot) because the user day-trades perpetuals.
- **Bybit v5 Linear `tickers`** — connects to `stream.bybit.com/v5/public/linear` and subscribes per-symbol (one `tickers.{SYMBOL}` subscription per symbol). Per-symbol subscription avoids a single invalid symbol killing the entire batch. Sends `snapshot` (full data) on subscribe, then `delta` (only changed fields) on updates — only emits when `lastPrice` is present.
- **Cross-exchange symbol mapping** — some symbols differ between exchanges (e.g. Binance `PEPEUSDT` = Bybit `1000PEPEUSDT`). `feeds/symbols.ts` exports `BYBIT_SYMBOL_MAP` (canonical → Bybit) and `BYBIT_SYMBOL_REVERSE` (Bybit → canonical). The Bybit feed translates on subscribe and reverse-maps on emit, so downstream consumers always see canonical symbol names.
- **price-bus decouples feeds from engine** — both exchanges publish canonical `PriceUpdate` events to the same bus; adding more sources later requires zero engine changes.
- **Notifier uses a queue** — prevents dropped messages under burst; respects Telegram rate limits (1 msg/sec/chat). The notifier is the only component that talks to the Telegram API for outbound messages. It receives trigger events from the engine, formats them via `formatters.ts`, and sends them through a FIFO queue with a 1 msg/sec/chat rate limit. If Telegram returns a 429 (rate limit), it backs off and retries. Messages are never dropped — they queue up and drain in order.

## Database Schema (Drizzle)

Three tables: `users` for identity, `alerts` for active alert configuration, and `alert_events` as an immutable audit trail of everything that happens. The `alerts.data` JSON column keeps the schema flexible — new alert types don't require migrations.

**`users`**: `id`, `chatId` (unique), `username`, `createdAt`, `isActive`

**`alerts`**: `id`, `userId` (FK), `type` (movement|threshold|percent_change|tick), `data` (JSON), `isActive`, `createdAt`

`data` payload per type:
- **movement**: `{ symbol, moveAmount, anchorPrice }` — e.g. `{ "symbol": "ETHUSDT", "moveAmount": 10, "anchorPrice": 2000 }` or `{ "symbol": "PEPEUSDT", "moveAmount": 0.00001, "anchorPrice": 0.00123 }`. `moveAmount` supports up to 5 decimal places. `anchorPrice` is set to the current price at creation time and re-anchored to the trigger price after each fire.
- **threshold** _(future)_: `{ symbol, targetPrice, direction }` — e.g. `{ "symbol": "BTCUSDT", "targetPrice": 100000, "direction": "above" }`
- **percent_change** _(future)_: `{ symbol, percentThreshold, windowMinutes }` — e.g. `{ "symbol": "ETHUSDT", "percentThreshold": 5, "windowMinutes": 60 }`
- **tick** _(future)_: `{ symbol, intervalSeconds }` — e.g. `{ "symbol": "BTCUSDT", "intervalSeconds": 300 }`

**`alert_events`**: `id`, `alertId` (FK), `userId` (FK), `type` (triggered|created|deactivated|dropped|edited), `snapshot` (JSON), `createdAt`

Immutable audit trail. `snapshot` contains a full copy of the alert as it was at event time — so edits to the alert never rewrite history. Used for history and analytics. Examples:
- `{ type: "triggered", price: 2010, alert: { id: 1, type: "movement", symbol: "ETHUSDT", moveAmount: 10, anchorPrice: 2000 } }`
- `{ type: "edited", alert: { id: 1, type: "movement", symbol: "ETHUSDT", moveAmount: 15, anchorPrice: 2010 }, previous: { moveAmount: 10 } }`
- `{ type: "dropped", alert: { id: 1, type: "movement", symbol: "ETHUSDT", moveAmount: 15, anchorPrice: 2010 } }`

**`priceSnapshots`** _(future)_: `id`, `symbol`, `price`, `recordedAt` - needed for percent-change alerts. Indexed on (symbol, recordedAt) for lookback queries.

## Alert Engine Logic

The alert engine is the core runtime loop. It sits between the price feeds and the notifier — receiving every price update, evaluating it against all active alerts, and dispatching notifications when conditions are met. Everything below defines how each alert type is evaluated, when it fires, and what happens after.

### How it runs

1. **price-bus emits a `PriceUpdate`** — `{ symbol, price, source, timestamp }`
2. **Engine receives it** and looks up active alerts for that symbol via `Map<string, Alert[]>` (O(1))
3. **Each matching alert is evaluated** by its type-specific strategy (see below)
4. **If triggered** → write `alert_event` (type: "triggered", snapshot of alert + price) → push to notifier queue
5. **Post-trigger behavior** depends on alert type (one-shot vs repeating)

### Type: Movement (`/alert ETH 10`)

- **Condition**: `abs(currentPrice - data.anchorPrice) >= data.moveAmount`
  - Fires in either direction — up or down — from the anchor
  - Example: anchor = 2000, moveAmount = 10 → fires at 2010 or 1990
  - Example: anchor = 0.00123, moveAmount = 0.00001 → fires at 0.00124 or 0.00122
- **Anchor**: Set to the live price at alert creation. After each trigger, re-anchored to the trigger price so the next move is measured from there.
- **Post-trigger**: Repeating — stays active, updates `data.anchorPrice` in DB to the price that triggered it
- **Edge case**: On restart, anchor is loaded from DB (`data.anchorPrice`) which already reflects the last re-anchor — no special recovery needed

### Type: Threshold _(future)_ (`/alert BTC 100000 above`)

- **Condition**: Compare current price against `data.targetPrice` using `data.direction`
  - `above`: triggers when `currentPrice >= targetPrice` AND `previousPrice < targetPrice` (crossing detection)
  - `below`: triggers when `currentPrice <= targetPrice` AND `previousPrice > targetPrice`
- **Requires**: Engine tracks `previousPrice` per symbol in memory to detect the cross — not just "is above" but "just crossed above"
- **Post-trigger**: One-shot — alert is deactivated (`isActive = false`), `alert_event` logged with type `deactivated` and reason `one_shot`
- **Edge case**: If bot restarts and price is already past target, do NOT fire — wait for an actual cross from the other side

### Type: Percent Change _(future)_ (`/change ETH 5 60`)

- **Condition**: Compare current price against `priceSnapshots` recorded `data.windowMinutes` ago
  - `percentChange = ((currentPrice - historicalPrice) / historicalPrice) * 100`
  - Triggers when `abs(percentChange) >= data.percentThreshold`
- **Requires**: `priceSnapshots` table populated by a periodic writer (every ~10s) storing `{ symbol, price, recordedAt }`
- **Lookback query**: `SELECT price FROM priceSnapshots WHERE symbol = ? AND recordedAt <= (now - windowMinutes) ORDER BY recordedAt DESC LIMIT 1`
- **Post-trigger**: Repeating — stays active but enters cooldown. Cooldown = `data.windowMinutes` (won't fire again until the window resets). Cooldown checked via last `triggered` event in `alert_events` for this alertId.
- **Cleanup**: Periodic job deletes snapshots older than the longest active `windowMinutes` across all alerts

### Type: Tick / Watch _(future)_ (`/watch BTC 300`)

- **Condition**: `now - lastSentTimestamp >= data.intervalSeconds`
- **Requires**: Engine tracks `lastSentTimestamp` per alert in memory (initialized from latest `triggered` event in `alert_events` on startup)
- **Post-trigger**: Repeating — resets `lastSentTimestamp` to now, stays active indefinitely
- **Deactivation**: Only when user runs `/unwatch`

### In-memory state

| State | Structure | Purpose |
|---|---|---|
| Active alerts by symbol | `Map<string, Alert[]>` | O(1) lookup per price tick |
| Anchor price per movement alert | Stored in `data.anchorPrice` (DB) | Movement trigger reference point |
| Previous price per symbol | `Map<string, number>` | Threshold crossing detection _(future)_ |
| Last sent per alert | `Map<number, number>` | Tick cooldown tracking _(future)_ |

All in-memory state is rebuilt from DB + `alert_events` on startup.

## Bot Commands

All interaction happens through Telegram commands. The bot parses arguments inline (e.g. `/alert ETH 10`) — no multi-step conversations or inline keyboards needed. Invalid input gets an immediate error with usage hint.

| Command | Example | Description |
|---|---|---|
| `/start` | `/start` | Register + welcome |
| `/alert` | `/alert ETH 10` | Movement alert ($10 move from current price) |
| `/edit` | `/edit 3 15` | Edit alert #3 to $15 move, resets anchor to current price |
| `/drop` | `/drop 3` or `/drop all` | Remove alert(s) |
| `/list` | `/list` | Show active alerts with IDs, symbol, amount, anchor |
| `/symbols` | `/symbols btc` | Search symbols from active Binance/Bybit streams |
| `/status` | `/status` | Uptime, active streams, last prices |
| `/help` | `/help` | Command reference |

## Phased Implementation

### Phase 0 - Bootstrap
> Goal: Project scaffolding, dependencies, config, WebSocket feeds, price bus, and bot shell. No business logic yet.

Split into seven mini-phases, each independently verifiable:

**0a — Project Init & Config** → `plans/00a-project-init.md`
`npm init`, deps, `tsconfig.json`, `.env.example`, `.gitignore`, `config.ts`, `symbols.ts`, scripts
**Verify**: `npm run dev` starts, config validates

**0b — Logger** → `plans/00b-logger.md`
Pino structured JSON logging singleton
**Verify**: structured log output with levels

**0c — Retry Utility** → `plans/00c-retry.md`
Generic exponential backoff for WS reconnect
**Verify**: retry with increasing delays on failure

**0d — Binance WebSocket Feed** → `plans/00d-binance-ws.md`
Connect to Binance USDT-M Futures combined stream (`fstream.binance.com`), subscribe to `miniTicker` for 10 symbols, parse, auto-reconnect
**Verify**: BTC price logged from Binance

**0e — Bybit WebSocket Feed** → `plans/00e-bybit-ws.md`
Connect to Bybit v5 linear WS (`stream.bybit.com/v5/public/linear`), per-symbol `tickers` subscription, cross-exchange symbol mapping (e.g. PEPEUSDT → 1000PEPEUSDT), handle snapshot/delta, auto-reconnect
**Verify**: BTC price logged from Bybit

**0f — Price Bus** → `plans/00f-price-bus.md`
EventEmitter normalizing both feeds into canonical `PriceUpdate`, tracks last prices + known symbols
**Verify**: prices from both sources flowing through single bus

**0g — Telegram Bot Shell** → `plans/00g-telegram-bot-shell.md`
grammY bot with `/start` and `/status`, graceful shutdown
**Verify**: `/start` → welcome, `/status` → live BTC from both sources

**0h — Bot Commands Menu** → `plans/00h-bot-commands-menu.md`
Register command list with Telegram via `bot.api.setMyCommands()` on startup so users see all commands in the "/" menu
**Verify**: tap "/" in Telegram chat → command menu shows all commands with descriptions

### Phase 2 - Storage + Movement Alerts
> Goal: Create a movement alert, receive a notification when price moves.

1. `db/schema.ts` + `db/client.ts` - Drizzle schema (`users`, `alerts`, `alert_events`), SQLite init, first migration
2. `services/user-store.ts` - User registration on `/start`
3. `services/alert-store.ts` - Alert CRUD (create, edit, drop, list)
4. `engine/movement-alert.ts` - Evaluate `abs(currentPrice - anchorPrice) >= moveAmount`, re-anchor on trigger
5. `engine/alert-engine.ts` - Core loop wiring price-bus to movement evaluator
6. `services/notifier.ts` - Rate-limited Telegram sender
7. `bot/commands/alert.ts` - `/alert ETH 10` creates movement alert with current price as anchor
8. `bot/commands/list.ts` - `/list` shows active alerts with ID, symbol, amount, anchor
9. `bot/commands/drop.ts` - `/drop 3` or `/drop all`
10. `bot/commands/edit.ts` - `/edit 3 15` updates amount, resets anchor, logs `edited` event
11. **Verify**: Create movement alert, wait for price move, receive notification. Edit it, verify re-anchor. Drop it, verify deactivation.

### Phase 3 - Polish + Deploy
> Goal: Production-ready on VPS.

1. `bot/formatters.ts` - Pretty MarkdownV2 messages (price formatting, up/down indicators, anchor info)
2. `bot/commands/symbols.ts` - `/symbols btc` searches active pairs from both streams
3. `bot/commands/help.ts` - `/help` command reference
4. Error handling: graceful shutdown (SIGTERM), WS recovery, DB safety
5. `tsup` build config + PM2 ecosystem file
6. Deploy to Namecheap VPS
7. **Verify**: End-to-end in production

## SaaS Expansion Seams (Future)

| Seam | Current (single-user) | Future (multi-user) |
|---|---|---|
| User identity | `TELEGRAM_ADMIN_CHAT_ID` env var | `users` table with tier/subscription |
| Alert ownership | All alerts = one user | `userId` FK already in schema |
| Rate limiting | Not needed | Per-user budget in notifier |
| Config | `.env` file | DB-backed per-user settings |
| Payments | N/A | Stripe webhooks, tier enforcement in alert-store |

All mutable operations route through `alert-store.ts` and `user-store.ts` - adding multi-user means adding auth checks there, not restructuring engine or feeds.