# Plan: US-00h — Bot Commands Menu

## Overview

Call `bot.api.setMyCommands()` on startup to register the command list with Telegram. This makes commands visible in the "/" menu in the chat UI.

## Prerequisites

- US-00g (Telegram Bot Shell) complete

## Steps

### 1. `src/bot/index.ts`

Before `bot.start()`, call `bot.api.setMyCommands()` with the full command list:

```typescript
await bot.api.setMyCommands([
  { command: "start", description: "Register and welcome" },
  { command: "alert", description: "Create movement alert (e.g. /alert ETH 10)" },
  { command: "list", description: "Show active alerts" },
  { command: "edit", description: "Edit alert amount (e.g. /edit 3 15)" },
  { command: "drop", description: "Remove alert(s) (e.g. /drop 3)" },
  { command: "symbols", description: "Search available symbols" },
  { command: "status", description: "System health" },
]);
```

## Files Modified

```
Modified:
  src/bot/index.ts  (add setMyCommands before bot.start)
```

## Verify

1. `npm run dev` → bot starts without errors
2. Open Telegram → tap "/" → command menu shows all commands with descriptions
