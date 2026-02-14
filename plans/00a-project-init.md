# Plan: US-00a — Project Init & Config

## Overview

Scaffold the project: `npm init`, install dependencies, configure TypeScript, env validation, symbol utility, and npm scripts.

## Steps

### 1. Project Init

```bash
npm init -y
```

Install dependencies:
```bash
npm install grammy better-sqlite3 drizzle-orm pino zod
npm install -D @types/better-sqlite3 drizzle-kit tsup typescript
```

### 2. `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src"]
}
```

Note: `verbatimModuleSyntax` required because Node 22's native TS (type stripping) needs explicit `type` imports.

### 3. `.env.example`

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
LOG_LEVEL=info
```

### 4. `.gitignore`

```
node_modules/
dist/
*.db
.env
```

### 5. `package.json` scripts

```json
{
  "scripts": {
    "dev": "node --watch --env-file=.env src/index.ts",
    "build": "tsup src/index.ts --format esm --dts --clean",
    "start": "node --env-file=.env dist/index.js"
  }
}
```

### 6. `src/config.ts`

- Zod schema: `TELEGRAM_BOT_TOKEN` (string, min 1), `TELEGRAM_ADMIN_CHAT_ID` (string, min 1), `LOG_LEVEL` (enum, default "info")
- Parse `process.env` through Zod — fail-fast with clear error
- Export typed `config` object

### 7. `src/utils/symbols.ts`

- `normalizeSymbol(input: string): string` — uppercases, appends "USDT" if no quote currency (e.g. "btc" → "BTCUSDT")

### 8. `src/index.ts` (placeholder)

- Import config (validates env on load)
- `console.log("Starting...")` to verify everything works

## Files Created

```
package.json, tsconfig.json, .env.example, .gitignore
src/
├── index.ts
├── config.ts
└── utils/
    └── symbols.ts
```

## Verify

1. Create `.env` from `.env.example` with valid bot token
2. `npm run dev` → logs "Starting..." with no errors
3. Remove a required env var → Zod throws clear validation error on startup
