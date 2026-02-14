# Plan: US-00e — Bybit WebSocket Feed

## Overview

Connect to Bybit v5 public WebSocket stream for linear (USDT perpetual) tickers. Subscribe per-symbol with cross-exchange symbol mapping. Parse ticker data (snapshot + delta) and emit normalized price updates via the same callback shape as Binance.

## Prerequisites

- US-00b (Logger) complete
- US-00c (Retry) complete — used for auto-reconnect
- US-00d (Binance WS) complete — shared types defined in `feeds/types.ts`, symbol list in `feeds/symbols.ts`

## Steps

### 1. `src/feeds/bybit-ws.ts`

- Connect to `wss://stream.bybit.com/v5/public/linear` via native `WebSocket` (linear perpetuals, not spot)
- **Per-symbol subscription**: subscribe one symbol at a time (`{ op: "subscribe", args: ["tickers.BTCUSDT"] }`) to avoid a single invalid symbol killing the entire batch
- **Cross-exchange symbol mapping**: use `BYBIT_SYMBOL_MAP` from `symbols.ts` to translate canonical names to Bybit names on subscribe (e.g. `PEPEUSDT` → `1000PEPEUSDT`). Use `BYBIT_SYMBOL_REVERSE` to map back to canonical names on emit.
- **Snapshot vs delta handling**: Bybit sends a `snapshot` (full data with all fields) on initial subscribe, then `delta` (only changed fields) on updates. Only emit a `PriceUpdate` when `lastPrice` is present in the message — deltas without `lastPrice` mean the last traded price hasn't changed.
- **Failed subscription warning**: if `{ op: "subscribe", success: false }` is received, log a warning with `ret_msg` but don't crash — other symbols continue working
- Send `{ op: "ping" }` every 20s for Bybit keep-alive (Bybit drops connections after ~30s without ping)
- Auto-reconnect on close/error with exponential backoff (using `retry.ts`)
- Track connection state and last message timestamp for health checks
- Export: `startBybitFeed(onPrice: (update: PriceUpdate) => void): { close: () => void, getHealth: () => FeedHealth }`

### 2. Wire into `src/index.ts`

- Start Bybit feed alongside Binance with a temporary `onPrice` callback that logs a sample price

## Known Cross-Exchange Symbol Differences

| Canonical (ours) | Bybit Linear | Reason |
|---|---|---|
| PEPEUSDT | 1000PEPEUSDT | Bybit lists PEPE as 1000PEPE for tick-size reasons |

More mappings may be needed as the symbol list grows. The mapping lives in `feeds/symbols.ts` and is easy to extend.

## Files Created/Modified

```
New:
  src/feeds/bybit-ws.ts

Modified:
  src/feeds/symbols.ts  (add BYBIT_SYMBOL_MAP, BYBIT_SYMBOL_REVERSE)
  src/index.ts           (start Bybit feed, log sample price)
```

## Verify

1. `npm run dev` → logs show "Bybit Linear WS connected"
2. Sample BTC price logged from Bybit within seconds
3. Both Binance and Bybit feeds running simultaneously
4. No subscription failure for PEPEUSDT (mapped to 1000PEPEUSDT)
5. Kill network → Bybit reconnect logs appear with backoff
