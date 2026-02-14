# US-00f: Price Bus

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Unified EventEmitter that normalizes price updates from all feeds into a single stream. Tracks last prices per symbol and known symbols per source. All consumers (engine, bot commands) subscribe here.

Both feeds already emit canonical symbol names (e.g. `PEPEUSDT`, not Bybit's `1000PEPEUSDT`) — the Bybit feed handles reverse mapping internally. The price bus does not need symbol translation. Currently scoped to 10 hardcoded USDT perpetual symbols.

## Plan

See: `plans/00f-price-bus.md`

## Depends On

- US-00d (Binance WS)
- US-00e (Bybit WS)

## Acceptance Criteria

- [x] `price-bus.ts` — `PriceBus` class with typed callback registry for `PriceUpdate` events
- [x] `publish(update)` and `subscribe(handler)` methods
- [x] Tracks last price per symbol in `Map<string, PriceUpdate>`
- [x] Tracks known symbols per source in `Map<string, Set<string>>`
- [x] `getLastPrice(symbol)` returns latest price update
- [x] `searchSymbols(query)` returns case-insensitive matches with source labels, capped at 20
- [x] Both feeds wired to publish to the bus in `index.ts`

## Verify

1. `npm run dev` → prices from both Binance and Bybit flowing through the bus ✅
2. `getLastPrice("BTCUSDT")` returns latest price with source and timestamp ✅
3. `searchSymbols("btc")` returns BTCUSDT from both sources ✅
4. `searchSymbols("xyznotreal")` returns empty array ✅
5. 79 updates received in 5 seconds through the bus ✅
