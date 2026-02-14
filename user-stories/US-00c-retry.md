# US-00c: Retry Utility

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Generic retry function with exponential backoff. Used by WebSocket feeds for auto-reconnect on connection failure.

## Plan

See: `plans/00c-retry.md`

## Depends On

- US-00b (Logger) — retry logs attempts via logger

## Acceptance Criteria

- [ ] `retry.ts` — `retry(fn, opts)` with exponential backoff
- [ ] Options: `maxRetries`, `baseDelayMs`, `maxDelayMs`
- [ ] Delay formula: `min(baseDelayMs * 2^attempt, maxDelayMs)` with optional jitter
- [ ] Logs each retry attempt with delay

## Verify

1. Call `retry` with a function that fails 3 times then succeeds — retries with increasing delays
2. Logs show retry attempts with backoff timing
