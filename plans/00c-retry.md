# Plan: US-00c — Retry Utility

## Overview

Generic retry function with exponential backoff. Used by WebSocket feeds for auto-reconnect.

## Prerequisites

- US-00b (Logger) complete — retry logs attempts using logger

## Steps

### 1. `src/utils/retry.ts`

- `retry(fn, opts)` — calls `fn`, retries on failure with exponential backoff
- Options: `maxRetries` (number, default Infinity), `baseDelayMs` (default 1000), `maxDelayMs` (default 30000)
- Delay formula: `min(baseDelayMs * 2^attempt, maxDelayMs)` with optional jitter
- Logs each retry attempt with delay via logger
- Returns the result of `fn` on success

## Files Created

```
New:
  src/utils/retry.ts
```

## Verify

1. Unit-level: call `retry` with a function that fails 3 times then succeeds — verify it retries with increasing delays
2. Logs show retry attempts with backoff timing
