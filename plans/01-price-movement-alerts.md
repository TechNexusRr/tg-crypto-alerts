# Plan: US-01 — Price Movement Alerts

## Overview

Implement the core movement alert: user creates an alert via `/alert ETH 10`, the engine evaluates it on every price tick, and fires a Telegram notification when the price moves by the specified amount. After triggering, the anchor re-centers to the trigger price.

## Prerequisites

- US-00 (Bootstrap) complete — price bus running, bot shell working

## Steps

### 1. Database Setup

**`src/db/client.ts`**
- Initialize `better-sqlite3` with a file path from config (e.g. `./data/alerts.db`)
- Initialize Drizzle ORM with the SQLite driver
- Run migrations on startup
- Export `db` instance

**`src/db/schema.ts`**
- `users` table: `id` (integer PK auto), `chatId` (text unique), `username` (text nullable), `createdAt` (integer, unix timestamp), `isActive` (integer, default 1)
- `alerts` table: `id` (integer PK auto), `userId` (integer FK → users.id), `type` (text), `data` (text — JSON string), `isActive` (integer, default 1), `createdAt` (integer, unix timestamp)
- `alertEvents` table: `id` (integer PK auto), `alertId` (integer FK → alerts.id), `userId` (integer FK → users.id), `type` (text), `snapshot` (text — JSON string), `createdAt` (integer, unix timestamp)
- Indexes: `alerts` on `(userId, isActive)`, `alertEvents` on `(alertId)`, `(userId, createdAt)`

**`drizzle.config.ts`**
- Point to `src/db/schema.ts`, SQLite driver, `src/db/migrations` output

Generate first migration: `npx drizzle-kit generate`

### 2. User Store

**`src/services/user-store.ts`**
- `findOrCreateUser(chatId: string, username?: string): User` — upsert on chatId
- Used by `/start` command to register user

### 3. Alert Store

**`src/services/alert-store.ts`**
- `createAlert(userId: number, type: string, data: object): Alert` — insert alert, log `created` event
- `getActiveAlertsBySymbol(symbol: string): Alert[]` — for engine lookups
- `getActiveAlertsByUser(userId: number): Alert[]` — for `/list`
- `updateAlertData(alertId: number, data: object): void` — for anchor re-center after trigger
- `logEvent(alertId: number, userId: number, type: string, snapshot: object): void` — insert into `alertEvents`

### 4. Movement Alert Evaluator

**`src/engine/movement-alert.ts`**
- `evaluateMovement(alert: Alert, currentPrice: number): { triggered: boolean, direction: "up" | "down" } | null`
- Logic: `abs(currentPrice - data.anchorPrice) >= data.moveAmount`
- If triggered, determine direction: `currentPrice > data.anchorPrice` → "up", else → "down"
- Pure function — no side effects

### 5. Alert Engine

**`src/engine/alert-engine.ts`**
- On startup: load all active alerts from DB, index by symbol into `Map<string, Alert[]>`
- Subscribe to price-bus `"price"` events
- On each `PriceUpdate`:
  1. Look up alerts for `update.symbol`
  2. For each alert, call `evaluateMovement(alert, update.price)`
  3. If triggered:
     - Log `triggered` event with full alert snapshot + trigger price
     - Update `data.anchorPrice` to trigger price in DB
     - Update in-memory alert object
     - Push notification to notifier
- Expose methods to add/remove/update alerts in the in-memory index (called by bot commands)

### 6. Notifier

**`src/services/notifier.ts`**
- FIFO queue of outbound messages
- Drains at 1 msg/sec/chat rate limit
- On Telegram 429 → exponential backoff + retry
- Messages are never dropped
- `queueNotification(chatId: string, text: string): void`

### 7. Bot Command: `/alert`

**`src/bot/commands/alert.ts`**
- Parse: `/alert <SYMBOL> <AMOUNT>`
- Validate: symbol exists in price-bus (known from active streams), amount > 0, amount has ≤ 5 decimal places
- Get current price for symbol from price-bus
- Create alert via `alert-store.createAlert()` with `{ symbol, moveAmount, anchorPrice: currentPrice }`
- Register alert in engine's in-memory index
- Reply: "Movement alert created for ETHUSDT — notify on $10 move from $2,000.00"

### 8. Wire Into Bot + Entry Point

**`src/bot/index.ts`** — register `/alert` command handler
**`src/index.ts`** — initialize DB, create alert engine, pass to bot

## Files Created/Modified

```
New:
  src/db/client.ts
  src/db/schema.ts
  src/db/migrations/          (generated)
  src/services/user-store.ts
  src/services/alert-store.ts
  src/services/notifier.ts
  src/engine/alert-engine.ts
  src/engine/movement-alert.ts
  src/bot/commands/alert.ts
  drizzle.config.ts

Modified:
  src/bot/index.ts            (register /alert, /start upserts user)
  src/index.ts                (init DB, engine, pass deps)
  src/config.ts               (add DB_PATH env var)
```

## Verify

1. `/alert ETH 10` → "Movement alert created for ETHUSDT — notify on $10 move from $2,000.00"
2. Wait for ETH price to move $10 → receive notification: "ETHUSDT moved up $10 to $2,010.00 (anchor was $2,000.00)"
3. Anchor re-centers — next trigger at $2,020 or $2,000
4. Check `alert_events` table — `created` and `triggered` events present with correct snapshots
5. `/alert PEPE 0.00001` → works with small decimal amounts
6. `/alert INVALID 10` → error: "Symbol INVALIDUSDT not found"
7. `/alert ETH` → error: "Usage: /alert <SYMBOL> <AMOUNT>"
