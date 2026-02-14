# Plan: US-03 — Symbol Discovery

## Overview

Implement `/symbols` command that lets users search tracked trading pairs. Currently scoped to 10 hardcoded USDT perpetual symbols; the price bus tracks which exchanges provide data for each.

All symbols use canonical names (e.g. `PEPEUSDT`, not Bybit's `1000PEPEUSDT`). The cross-exchange mapping is transparent to this layer.

## Prerequisites

- US-00 (Bootstrap) complete — both WS feeds running and price-bus tracking known symbols per source

## Steps

### 1. Price Bus: Symbol Registry

**`src/feeds/price-bus.ts`** — already tracks last price per symbol. Add:
- `getKnownSymbols(): Map<string, Set<string>>` — returns `{ "BTCUSDT": Set("binance", "bybit"), ... }`
- Built automatically as price updates arrive — each `PriceUpdate` registers the canonical symbol + source
- `searchSymbols(query: string): Array<{ symbol: string, sources: string[] }>` — case-insensitive substring match, sorted alphabetically, capped at 20 results

### 2. Bot Command: `/symbols`

**`src/bot/commands/symbols.ts`**
- Parse: `/symbols <query>`
- Call `priceBus.searchSymbols(query)`
- Format results:
  ```
  Symbols matching "btc":
  BTCUSDT — Binance, Bybit
  (showing 1 of 1 match)
  ```
- No results: "No symbols matching 'xyz'. Try /symbols btc"
- No query: "Usage: /symbols <query>"

### 3. Wire Into Bot

**`src/bot/index.ts`** — register `/symbols` command handler

## Files Created/Modified

```
New:
  src/bot/commands/symbols.ts

Modified:
  src/feeds/price-bus.ts       (add symbol registry + search)
  src/bot/index.ts             (register /symbols)
```

## Verify

1. `/symbols btc` → lists BTCUSDT from both exchanges
2. `/symbols pepe` → shows PEPEUSDT (canonical name) with source labels
3. `/symbols xyznotreal` → "No symbols matching 'xyznotreal'"
4. `/symbols` (no arg) → usage hint
5. Search returns max 20 results
