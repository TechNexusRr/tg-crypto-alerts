import { config } from "./config.ts";
import { logger } from "./utils/logger.ts";
import { runMigrations } from "./db/client.ts";
import { startBinanceFeed } from "./feeds/binance-ws.ts";
import { startBybitFeed } from "./feeds/bybit-ws.ts";
import { PriceBus } from "./feeds/price-bus.ts";
import { startAlertEngine } from "./engine/alert-engine.ts";
import { startBot } from "./bot/index.ts";

logger.info({ logLevel: config.LOG_LEVEL }, "Starting tg-crypto-alerts...");

// Initialize database
runMigrations();

const priceBus = new PriceBus();

const binance = startBinanceFeed((update) => priceBus.publish(update));
const bybit = startBybitFeed((update) => priceBus.publish(update));

// Start alert engine (subscribes to price bus)
startAlertEngine(priceBus);

const bot = await startBot({
  priceBus,
  getBinanceHealth: binance.getHealth,
  getBybitHealth: bybit.getHealth,
});

async function shutdown() {
  logger.info("Shutting down...");
  await bot.stop();
  binance.close();
  bybit.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
