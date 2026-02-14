# US-00e: Bybit WebSocket Feed

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Connect to Bybit v5 public WebSocket stream for linear (USDT perpetual) tickers. Parse ticker data and emit normalized price updates using the same `PriceUpdate` shape as Binance.

## Plan

See: `plans/00e-bybit-ws.md`

## Depends On

- US-00b (Logger)
- US-00c (Retry)
- US-00d (Binance WS) — shared types defined in `feeds/types.ts`

## Acceptance Criteria

- [x] `bybit-ws.ts` — connects to `wss://stream.bybit.com/v5/public/linear`
- [x] Subscribes to `tickers` topic per symbol for USDT perpetuals
- [x] Handles Bybit symbol mapping (e.g. PEPEUSDT → 1000PEPEUSDT) and reverse mapping on emit
- [x] Parses ticker data (snapshot + delta), emits `PriceUpdate { symbol, price, source: "bybit", timestamp }`
- [x] Sends ping every 20s for Bybit keep-alive
- [x] Auto-reconnects on close/error with exponential backoff
- [x] Tracks connection state and last message timestamp
- [x] Logs warnings for failed subscriptions without killing the batch

## Verify

1. `npm run dev` → logs "Bybit Linear WS connected" ✅
2. Sample BTC price logged from Bybit within seconds ✅
3. Both Binance and Bybit feeds running simultaneously ✅
4. Kill network → Bybit reconnect logs with backoff
