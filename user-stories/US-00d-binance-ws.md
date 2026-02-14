# US-00d: Binance WebSocket Feed

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Connect to Binance USDT-M Futures combined stream via Node 22's native WebSocket. Subscribe to `miniTicker` for 10 hardcoded symbols. Parse ticker data and emit normalized price updates. Auto-reconnect on failure using the retry utility.

## Plan

See: `plans/00d-binance-ws.md`

## Depends On

- US-00b (Logger)
- US-00c (Retry)

## Acceptance Criteria

- [x] `binance-ws.ts` — connects to `wss://fstream.binance.com/stream?streams=...` (USDT-M Futures combined stream)
- [x] Subscribes to `{symbol}@miniTicker` for each symbol in `WATCHED_SYMBOLS`
- [x] Parses combined stream format `{ stream, data: { s, c } }` — extracts symbol and close price
- [x] Emits `PriceUpdate { symbol, price, source: "binance", timestamp }` via callback
- [x] Auto-reconnects on close/error with exponential backoff
- [x] Tracks connection state and last message timestamp for health checks
- [x] Shared `PriceUpdate` and `FeedHealth` types defined in `feeds/types.ts`

## Verify

1. `npm run dev` → logs "Binance Futures WS connected" ✅
2. Sample BTC price logged from Binance within seconds ✅
3. Kill network → reconnect logs with backoff delays
4. Restore network → connection re-establishes
