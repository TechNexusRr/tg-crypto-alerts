# Plan: US-00f — Price Bus

## Overview

Unified EventEmitter that normalizes price updates from all feeds into a single stream. All consumers (engine, bot commands) subscribe here instead of to individual feeds.

Both feeds already emit canonical symbol names (e.g. `PEPEUSDT`, not `1000PEPEUSDT`) — the Bybit feed handles reverse mapping internally. The price bus does not need to do any symbol translation.

## Prerequisites

- US-00d (Binance WS) complete
- US-00e (Bybit WS) complete

## Important context

- Feeds are scoped to 10 hardcoded USDT perpetual symbols in `feeds/symbols.ts`
- Both feeds emit canonical symbol names — Bybit's cross-exchange mapping (e.g. `1000PEPEUSDT` → `PEPEUSDT`) is handled in the feed layer
- The bus receives `PriceUpdate` events with `source: "binance" | "bybit"` so consumers can distinguish when needed

## Steps

### 1. `src/feeds/price-bus.ts`

- Typed EventEmitter (or simple callback registry)
- Event: `"price"` → `PriceUpdate { symbol, price, source, timestamp }`
- Methods: `publish(update: PriceUpdate)`, `subscribe(handler: (update: PriceUpdate) => void)`
- Track last price per symbol in a `Map<string, PriceUpdate>` for queries (e.g. `/status`)
- Track known symbols per source in a `Map<string, Set<string>>` for symbol discovery
- `getLastPrice(symbol: string): PriceUpdate | undefined`
- `getKnownSymbols(): Map<string, Set<string>>`
- `searchSymbols(query: string): Array<{ symbol: string, sources: string[] }>`

### 2. Wire feeds into price bus in `src/index.ts`

- Create price-bus instance
- Replace temporary `onPrice` callbacks with `priceBus.publish`
- Both feeds now publish to the bus

## Files Created/Modified

```
New:
  src/feeds/price-bus.ts

Modified:
  src/index.ts  (create bus, wire feeds to bus)
```

## Verify

1. `npm run dev` → prices from both Binance and Bybit flowing through the bus
2. `priceBus.getLastPrice("BTCUSDT")` returns latest price
3. `priceBus.searchSymbols("btc")` returns BTC pairs from both sources
