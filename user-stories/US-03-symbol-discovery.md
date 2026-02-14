# US-03: Symbol Discovery

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Users need to find the correct symbol name before creating an alert. The bot exposes a search command that queries the symbols currently tracked by the price bus. Currently scoped to 10 hardcoded USDT perpetual symbols (defined in `feeds/symbols.ts`); the list will grow when dynamic subscription is added.

Note: the bot uses canonical symbol names throughout (e.g. `PEPEUSDT`, not Bybit's `1000PEPEUSDT`). Users never need to know about exchange-specific symbol differences — that mapping is handled in the feed layer.

## User Stories

- As a user, I want to search available symbols (e.g. `/symbols btc`) so I can find the exact pair name before creating an alert

## Command

`/symbols <query>` — e.g. `/symbols btc`, `/symbols pepe`

## Acceptance Criteria

- [x] `/symbols btc` returns a list of matching pairs tracked by the price bus (e.g. BTCUSDT)
- [x] Results indicate which exchange(s) each symbol is available on (Binance, Bybit, or both)
- [x] Search is case-insensitive (substring match)
- [x] No results returns a friendly "no matches" message
- [x] Results are capped to avoid flooding chat (top 20 matches)

## Depends On

- US-00 (Bootstrap) — needs active WS streams and price bus to know which symbols are available
