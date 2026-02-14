# Plan: US-04 — System Health

## Overview

Enrich the `/status` command (basic version from bootstrap) with full system health: connection states, last message timestamps, active alert count, and uptime.

## Prerequisites

- US-00 (Bootstrap) complete — basic `/status` exists
- US-01 (Price Movement Alerts) complete — alerts exist to count

## Steps

### 1. Feed Health Tracking

**`src/feeds/binance-ws.ts`** and **`src/feeds/bybit-ws.ts`** — expose health info:
- `getHealth(): { connected: boolean, lastMessageAt: number | null, reconnectCount: number }`
- Already tracking internally from bootstrap — just expose via a getter

### 2. Enhanced `/status` Command

**`src/bot/commands/status.ts`**
- Gather:
  - Process uptime (`process.uptime()`)
  - Binance health (connected, last msg timestamp, reconnects)
  - Bybit health (connected, last msg timestamp, reconnects)
  - Last BTC price from each source (from price-bus)
  - Active alert count (from alert-store or engine)
- Format:
  ```
  ⚙️ System Status
  Uptime: 2h 15m

  Binance WS: ✅ connected (last msg: 1s ago, reconnects: 0)
  Bybit WS: ✅ connected (last msg: 2s ago, reconnects: 1)

  BTC: $97,500.00 (Binance) / $97,501.50 (Bybit)
  Active alerts: 5
  ```
- If a feed is disconnected: show ❌ and time since last message

### 3. Wire Into Bot

**`src/bot/index.ts`** — replace basic `/status` with enhanced version, or move to `src/bot/commands/status.ts`

## Files Created/Modified

```
New:
  src/bot/commands/status.ts

Modified:
  src/feeds/binance-ws.ts   (expose getHealth)
  src/feeds/bybit-ws.ts     (expose getHealth)
  src/bot/index.ts           (register enhanced /status)
```

## Verify

1. `/status` → shows uptime, both WS states, BTC prices, alert count
2. Disconnect network briefly → `/status` shows ❌ for affected feed
3. Reconnect → `/status` shows ✅ again with reconnect count incremented
