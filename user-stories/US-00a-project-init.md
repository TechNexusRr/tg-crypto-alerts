# US-00a: Project Init & Config

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | OK |
| QA | OK |

## Description

Scaffold the project from scratch: initialize npm, install all dependencies, configure TypeScript for Node 22 native execution, set up environment validation with Zod, and create the symbol normalization utility.

## Plan

See: `plans/00a-project-init.md`

## Acceptance Criteria

- [ ] Node.js 22 project initialized with `npm init`
- [ ] `package.json` with all core dependencies: `grammy`, `better-sqlite3`, `drizzle-orm`, `pino`, `zod`, `tsup`
- [ ] `tsconfig.json` configured for Node 22 native TS execution with `verbatimModuleSyntax`
- [ ] `.env.example` with all required env vars documented (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `LOG_LEVEL`)
- [ ] `.gitignore` covering `node_modules`, `dist`, `.env`, `*.db`
- [ ] `config.ts` — Zod-validated env loading, fail-fast on invalid config
- [ ] `symbols.ts` — `normalizeSymbol()` uppercases and appends USDT if needed
- [ ] `dev` script: `node --watch --env-file=.env src/index.ts`
- [ ] `build` script: `tsup src/index.ts --format esm --dts --clean`
- [ ] `start` script: `node --env-file=.env dist/index.js`
- [ ] Placeholder `index.ts` that imports config and logs startup

## Verify

1. Create `.env` from `.env.example` with valid bot token
2. `npm run dev` → logs "Starting..." with no errors
3. Remove a required env var → Zod throws clear validation error on startup
