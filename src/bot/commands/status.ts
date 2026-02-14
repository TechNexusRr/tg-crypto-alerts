import type { Context } from "grammy";
import type { PriceBus } from "../../feeds/price-bus.ts";
import type { FeedHealth } from "../../feeds/types.ts";
import { getActiveAlertCount } from "../../services/alert-store.ts";
import { formatPrice } from "../formatters.ts";

interface StatusDeps {
  priceBus: PriceBus;
  getBinanceHealth: () => FeedHealth;
  getBybitHealth: () => FeedHealth;
  startedAt: number;
}

export function statusCommand(deps: StatusDeps) {
  return (ctx: Context) => {
    const { priceBus, getBinanceHealth, getBybitHealth, startedAt } = deps;

    const uptimeMs = Date.now() - startedAt;
    const uptime = formatUptime(uptimeMs);

    const binanceHealth = getBinanceHealth();
    const bybitHealth = getBybitHealth();

    let msg = `System Status\n\n`;
    msg += `Uptime: ${uptime}\n\n`;

    // Feed health
    msg += formatFeedHealth("Binance", binanceHealth);
    msg += formatFeedHealth("Bybit", bybitHealth);

    // BTC prices from each source
    const binanceBtc = priceBus.getLastPriceBySource("BTCUSDT", "binance");
    const bybitBtc = priceBus.getLastPriceBySource("BTCUSDT", "bybit");

    msg += "\n";
    if (binanceBtc || bybitBtc) {
      msg += "BTC: ";
      const parts: string[] = [];
      if (binanceBtc) parts.push(`$${formatPrice(binanceBtc.price)} (Binance)`);
      if (bybitBtc) parts.push(`$${formatPrice(bybitBtc.price)} (Bybit)`);
      msg += parts.join(" / ") + "\n";
    } else {
      msg += "BTC: waiting for data...\n";
    }

    // Alert count
    const alertCount = getActiveAlertCount();
    msg += `Active alerts: ${alertCount}\n`;

    return ctx.reply(msg);
  };
}

function formatFeedHealth(name: string, health: FeedHealth): string {
  const status = health.connected ? "connected" : "disconnected";
  const icon = health.connected ? "+" : "x";
  let line = `[${icon}] ${name}: ${status}`;

  if (health.lastMessageAt) {
    line += ` (last msg: ${formatAge(health.lastMessageAt)}`;
  }

  if (health.reconnectCount > 0) {
    line += `, reconnects: ${health.reconnectCount}`;
  }

  if (health.lastMessageAt) {
    line += ")";
  } else if (health.reconnectCount > 0) {
    line += ")";
  }

  return line + "\n";
}

function formatAge(timestamp: number): string {
  const ageMs = Date.now() - timestamp;
  if (ageMs < 1000) return "just now";
  if (ageMs < 60_000) return `${Math.floor(ageMs / 1000)}s ago`;
  return `${Math.floor(ageMs / 60_000)}m ago`;
}

function formatUptime(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}
