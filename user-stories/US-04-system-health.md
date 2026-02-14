# US-04: System Health

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Users need to verify the bot is running correctly — that WebSocket connections are alive, data is flowing, and the system is responsive.

## User Stories

- As a user, I want to check the bot's status (uptime, active streams, last prices) to know it's running correctly

## Command

`/status` — no arguments

## Acceptance Criteria

- [x] `/status` returns: uptime, Binance WS state (connected/disconnected + last message timestamp), Bybit WS state (connected/disconnected + last message timestamp), last BTC price from each source, number of active alerts
- [x] Response is formatted cleanly in a single Telegram message
- [x] Works even if one or both WS connections are down (shows disconnected state)

## Depends On

- US-00 (Bootstrap) — basic `/status` is part of bootstrap; this story enriches it with alert count and connection health details
