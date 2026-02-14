import { Bot } from "grammy";
import { config } from "../config.ts";
import { logger } from "../utils/logger.ts";
import type { PriceBus } from "../feeds/price-bus.ts";
import { findOrCreateUser } from "../services/user-store.ts";
import { alertCommand } from "./commands/alert.ts";
import { listCommand } from "./commands/list.ts";
import { dropCommand } from "./commands/drop.ts";
import { editCommand } from "./commands/edit.ts";
import { symbolsCommand } from "./commands/symbols.ts";
import { statusCommand } from "./commands/status.ts";
import type { FeedHealth } from "../feeds/types.ts";

const startedAt = Date.now();

interface BotDeps {
  priceBus: PriceBus;
  getBinanceHealth: () => FeedHealth;
  getBybitHealth: () => FeedHealth;
}

export async function startBot(deps: BotDeps): Promise<{ stop: () => Promise<void> }> {
  const { priceBus } = deps;
  const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

  bot.command("start", (ctx) => {
    // Upsert user on /start
    const chatId = ctx.chat?.id.toString() ?? "";
    const username = ctx.from?.username;
    findOrCreateUser(chatId, username);

    return ctx.reply(
      "Welcome to Crypto Alerts!\n\n" +
        "I monitor crypto prices and send you alerts when they move.\n\n" +
        "Commands:\n" +
        "/alert <symbol> <amount> — alert on price movement\n" +
        "/list — show active alerts\n" +
        "/drop <id|all> — remove alert(s)\n" +
        "/edit <id> <amount> — edit alert amount\n" +
        "/symbols <query> — search symbols\n" +
        "/status — system health\n" +
        "/help — command reference",
    );
  });

  bot.command("alert", alertCommand(priceBus));
  bot.command("list", listCommand());
  bot.command("drop", dropCommand());
  bot.command("edit", editCommand(priceBus));
  bot.command("symbols", symbolsCommand(priceBus));
  bot.command("status", statusCommand({
    priceBus,
    getBinanceHealth: deps.getBinanceHealth,
    getBybitHealth: deps.getBybitHealth,
    startedAt,
  }));

  bot.catch((err) => {
    logger.error({ err: err.error }, "Bot error");
  });

  // Register command menu with Telegram
  await bot.api.setMyCommands([
    { command: "start", description: "Register and welcome" },
    { command: "alert", description: "Create movement alert (e.g. /alert ETH 10)" },
    { command: "list", description: "Show active alerts" },
    { command: "edit", description: "Edit alert amount (e.g. /edit 3 15)" },
    { command: "drop", description: "Remove alert(s) (e.g. /drop 3)" },
    { command: "symbols", description: "Search available symbols" },
    { command: "status", description: "System health" },
  ]);

  // Start long polling
  bot.start({
    onStart: (botInfo) => {
      logger.info({ username: botInfo.username }, "Telegram bot started");
    },
  });

  return {
    stop: () => bot.stop(),
  };
}
