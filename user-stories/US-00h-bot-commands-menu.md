# US-00h: Bot Commands Menu

## Workflow

| Stage | Status |
|---|---|
| Draft | OK |
| Reviewed | OK |
| Implement | OK |
| Code Review | |
| QA | |

## Description

Register the bot's command list with Telegram via `setMyCommands` on startup, so users see the available commands in the Telegram command menu (the "/" button next to the message input).

## User Stories

- As a user, I want to see all available commands in the Telegram command menu when I tap "/", so I don't have to memorize them

## Depends On

- US-00g (Telegram Bot Shell) — bot must be running

## Acceptance Criteria

- [ ] Bot calls `bot.api.setMyCommands()` on startup with all commands
- [ ] Tapping "/" in the Telegram chat shows the command list with descriptions
- [ ] Command list matches the actual registered commands

## Verify

1. `npm run dev` → bot starts
2. Open Telegram chat with bot → tap "/" → command menu appears with all commands and descriptions
