# US-00b: Logger

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Set up Pino structured JSON logging as a singleton. All subsequent modules will import the logger instead of using `console.log`.

## Plan

See: `plans/00b-logger.md`

## Depends On

- US-00a (Project Init) — `config.ts` provides `LOG_LEVEL`

## Acceptance Criteria

- [ ] `logger.ts` — Pino logger singleton using `config.LOG_LEVEL`
- [ ] `index.ts` updated to use `logger.info()` instead of `console.log()`
- [ ] Structured JSON output with level and timestamp

## Verify

1. `npm run dev` → structured JSON log output
2. Set `LOG_LEVEL=debug` → debug messages appear
3. Set `LOG_LEVEL=warn` → info messages suppressed
