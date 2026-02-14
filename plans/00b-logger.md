# Plan: US-00b — Logger

## Overview

Set up Pino structured JSON logging. All subsequent modules will import the logger singleton.

## Prerequisites

- US-00a (Project Init) complete — `config.ts` provides `LOG_LEVEL`

## Steps

### 1. `src/utils/logger.ts`

- Import pino, create logger with `config.LOG_LEVEL`
- Export singleton `logger`

### 2. Update `src/index.ts`

- Replace `console.log` with `logger.info("Starting...")`

## Files Created/Modified

```
New:
  src/utils/logger.ts

Modified:
  src/index.ts  (use logger instead of console.log)
```

## Verify

1. `npm run dev` → structured JSON log output with level and timestamp
2. Set `LOG_LEVEL=debug` in `.env` → debug messages appear
3. Set `LOG_LEVEL=warn` → info messages suppressed
