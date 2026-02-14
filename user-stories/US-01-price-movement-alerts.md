# US-01: Price Movement Alerts

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

The core alert type. A user creates a movement alert for a symbol with a dollar amount. The bot tracks the price and notifies the user when the price moves by that amount in either direction from the anchor price. After each trigger, the anchor re-centers to the trigger price so the next notification fires on the next move of the same size.

## User Stories

- As a user, I want to be notified when ETH moves by $10 from its current price, so if ETH is at $2,000 when I create the alert, I get notified when it hits $2,010 or $1,990
- As a user, I want the alert to keep firing on each subsequent $10 move (re-anchors to the trigger price), so I stay informed as the price continues to move
- As a user, I want to set different movement amounts per symbol (e.g. $100 for BTC, $10 for ETH)
- As a user, I want to use decimal precision up to 5 places for the movement amount (e.g. `/alert PEPE 0.00001`) so I can track low-price tokens accurately

## Command

`/alert <SYMBOL> <AMOUNT>` — e.g. `/alert ETH 10`, `/alert PEPE 0.00001`

## Acceptance Criteria

- [x] `/alert ETH 10` creates a movement alert with anchor = current live price
- [x] Alert fires when `abs(currentPrice - anchorPrice) >= moveAmount` in either direction
- [x] After trigger, anchor resets to the trigger price
- [x] `alert_event` with type `created` is logged on creation
- [x] `alert_event` with type `triggered` is logged on each fire, with full alert snapshot + trigger price
- [x] Notification sent to user via Telegram with symbol, direction (up/down), trigger price, and move amount
- [x] Decimal precision up to 5 places works correctly (e.g. 0.00001)
- [x] Invalid input (missing args, unknown symbol, negative amount) returns error with usage hint

## Depends On

- US-00 (Bootstrap) — needs price bus, bot, and DB running
