# Plan: US-02 — Alert Management

## Overview

Implement `/list`, `/drop`, and `/edit` commands so users can view, delete, and modify their movement alerts. All changes are recorded in the `alert_events` audit trail with full snapshots.

## Prerequisites

- US-01 (Price Movement Alerts) complete — alerts exist in DB and engine

## Steps

### 1. Bot Command: `/list`

**`src/bot/commands/list.ts`**
- Query `alert-store.getActiveAlertsByUser(userId)`
- Format as a Telegram message using `formatters.ts`:
  ```
  📋 Active Alerts:
  #1 — ETHUSDT | $10 move | anchor: $2,000.00
  #2 — BTCUSDT | $100 move | anchor: $95,000.00
  #3 — PEPEUSDT | $0.00001 move | anchor: $0.00123
  ```
- If no active alerts: "No active alerts. Use /alert to create one."

### 2. Bot Command: `/drop`

**`src/bot/commands/drop.ts`**
- Parse: `/drop <id>` or `/drop all`
- **Single drop**: validate alert exists, belongs to user, is active
  - Set `isActive = false` in DB
  - Log `dropped` event with full alert snapshot
  - Remove from engine's in-memory index
  - Reply: "Alert #3 dropped."
- **Drop all**: get all active alerts for user
  - Set each `isActive = false`
  - Log `dropped` event for each
  - Remove all from engine index
  - Reply: "Dropped 3 alert(s)."
- Invalid ID or not owned: "Alert #99 not found."

### 3. Bot Command: `/edit`

**`src/bot/commands/edit.ts`**
- Parse: `/edit <id> <newAmount>`
- Validate: alert exists, belongs to user, is active, newAmount > 0, ≤ 5 decimal places
- Get current live price for the alert's symbol from price-bus
- Log `edited` event with snapshot containing **both** current alert state and `previous` values: `{ alert: { ...updatedAlert }, previous: { moveAmount: oldAmount, anchorPrice: oldAnchor } }`
- Update alert in DB: `data.moveAmount = newAmount`, `data.anchorPrice = currentPrice`
- Update in engine's in-memory index
- Reply: "Alert #3 updated — $15 move from $2,050.00 (was $10 from $2,000.00)"

### 4. Alert Store Extensions

**`src/services/alert-store.ts`** — add methods:
- `deactivateAlert(alertId: number): void` — set `isActive = false`
- `deactivateAllForUser(userId: number): Alert[]` — returns deactivated alerts for event logging
- `editAlert(alertId: number, newData: object): Alert` — update `data` column, return updated alert

### 5. Formatters

**`src/bot/formatters.ts`**
- `formatAlertList(alerts: Alert[]): string` — formatted list for `/list`
- `formatPrice(price: number): string` — smart decimal formatting (2 decimals for large prices, up to 5 for micro prices)
- Used by `/list`, `/alert`, `/edit`, `/drop`, and notifications

### 6. Wire Into Bot

**`src/bot/index.ts`** — register `/list`, `/drop`, `/edit` command handlers

## Files Created/Modified

```
New:
  src/bot/commands/list.ts
  src/bot/commands/drop.ts
  src/bot/commands/edit.ts
  src/bot/formatters.ts

Modified:
  src/services/alert-store.ts  (add deactivate, edit methods)
  src/bot/index.ts             (register new commands)
  src/engine/alert-engine.ts   (expose removeAlert, updateAlert methods)
```

## Verify

1. Create 3 alerts → `/list` shows all three with correct details
2. `/drop 2` → alert #2 gone from `/list`, `dropped` event in DB
3. `/drop all` → all alerts gone, events logged for each
4. Create alert → `/edit 1 15` → anchor resets, amount changes, `edited` event has previous values
5. `/edit 999 10` → "Alert #999 not found."
6. `/list` with no alerts → "No active alerts."
