# US-00: Bootstrap Project (Overview)

## Description

Set up the project codebase from scratch — runtime, dependencies, configuration, build tooling, and the foundational infrastructure (WebSocket feeds, price bus, bot shell) so that all subsequent user stories have a working base to build on.

## Sub-Stories

| Story | Description | Depends On | Status |
|---|---|---|---|
| [US-00a](US-00a-project-init.md) | Project Init & Config | — | OK |
| [US-00b](US-00b-logger.md) | Logger | US-00a | OK |
| [US-00c](US-00c-retry.md) | Retry Utility | US-00b | OK |
| [US-00d](US-00d-binance-ws.md) | Binance WebSocket Feed | US-00b, US-00c | OK |
| [US-00e](US-00e-bybit-ws.md) | Bybit WebSocket Feed | US-00b, US-00c, US-00d | OK |
| [US-00f](US-00f-price-bus.md) | Price Bus | US-00d, US-00e | OK |
| [US-00g](US-00g-telegram-bot-shell.md) | Telegram Bot Shell | US-00a, US-00f | OK |

## Verify (end-to-end)

- Run `npm run dev`, bot starts without errors
- Send `/start` in Telegram, receive welcome message
- Send `/status`, see live BTC price from Binance and Bybit
- Kill and restart — WS auto-reconnects
