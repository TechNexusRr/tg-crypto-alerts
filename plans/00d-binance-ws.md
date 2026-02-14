# Plan: US-00d — Binance WebSocket Feed

## Overview

Connect to Binance USDT-M Futures combined stream via native WebSocket. Subscribe to `miniTicker` for 10 hardcoded symbols defined in `feeds/symbols.ts`. Parse ticker data and emit normalized price updates via a callback.

## Prerequisites

- US-00b (Logger) complete
- US-00c (Retry) complete — used for auto-reconnect

## Steps

### 1. `src/feeds/symbols.ts`

- Hardcoded list of 10 USDT perpetual symbols: BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK, PEPE
- Shared by both Binance and Bybit feeds
- Also exports `BYBIT_SYMBOL_MAP` / `BYBIT_SYMBOL_REVERSE` for cross-exchange symbol name differences (used by Bybit feed)

### 2. `src/feeds/binance-ws.ts`

- Build combined stream URL: `wss://fstream.binance.com/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker/...` from `WATCHED_SYMBOLS`
- USDT-M Futures (not spot) — the user day-trades perpetuals
- Parse combined stream format: `{ stream: string, data: { s: string, c: string } }` — extract symbol `s` and close price `c`
- Emit normalized events to a callback: `{ symbol: string, price: number, source: "binance", timestamp: number }`
- Auto-reconnect on close/error with exponential backoff (using `retry.ts`)
- Track connection state and last message timestamp for health checks
- Export: `startBinanceFeed(onPrice: (update: PriceUpdate) => void): { close: () => void, getHealth: () => FeedHealth }`

### 3. Define shared types

**`src/feeds/types.ts`**
- `PriceUpdate { symbol: string, price: number, source: string, timestamp: number }`
- `FeedHealth { connected: boolean, lastMessageAt: number | null, reconnectCount: number }`

### 4. Wire into `src/index.ts`

- Start Binance feed with a temporary `onPrice` callback that logs a sample price
- Verify connection and data flow

## Files Created/Modified

```
New:
  src/feeds/symbols.ts
  src/feeds/binance-ws.ts
  src/feeds/types.ts

Modified:
  src/index.ts  (start Binance feed, log sample price)
```

## Verify

1. `npm run dev` → logs show "Binance Futures WS connected"
2. Sample BTC price logged from Binance within seconds
3. Kill network → reconnect logs appear with backoff delays
4. Restore network → connection re-establishes
