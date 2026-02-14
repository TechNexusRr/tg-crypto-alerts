# US-02: Alert Management

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Users need to view, edit, and delete their alerts. Editing an alert updates the move amount and resets the anchor to the current price, with the previous state preserved in the audit trail. All lifecycle events (created, edited, dropped) are recorded as immutable `alert_events`.

## User Stories

- As a user, I want to list all my active movement alerts with their IDs, symbol, move amount, and current anchor price
- As a user, I want to drop a specific alert by ID (`/drop 3`) or drop all alerts at once (`/drop all`)
- As a user, I want to edit an existing movement alert's amount (`/edit 3 15`) and have the anchor reset to the current price, with the old values preserved in the audit trail
- As a user, I want a full history of triggered, edited, and dropped alerts so I can review what happened and when

## Commands

- `/list` — show all active alerts with ID, symbol, move amount, anchor price
- `/drop <id>` or `/drop all` — deactivate alert(s), log `dropped` event
- `/edit <id> <newAmount>` — update move amount, reset anchor to current price, log `edited` event

## Acceptance Criteria

- [x] `/list` shows formatted table of active alerts (ID, symbol, amount, anchor)
- [x] `/list` with no active alerts shows a friendly "no alerts" message
- [x] `/drop 3` deactivates alert #3 (`isActive = false`), logs `dropped` event with full alert snapshot
- [x] `/drop all` deactivates all active alerts, logs `dropped` event for each
- [x] `/edit 3 15` updates alert #3's `moveAmount` to 15, resets `anchorPrice` to current live price, logs `edited` event with previous values
- [x] Invalid IDs or editing inactive alerts return clear error messages
- [x] All events visible in `alert_events` table with correct snapshots

## Depends On

- US-01 (Price Movement Alerts) — needs alerts to exist before managing them
