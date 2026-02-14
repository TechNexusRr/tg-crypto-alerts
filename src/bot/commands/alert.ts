import type { Context } from "grammy";
import type { PriceBus } from "../../feeds/price-bus.ts";
import { findOrCreateUser } from "../../services/user-store.ts";
import { createAlert } from "../../services/alert-store.ts";
import { registerAlert } from "../../engine/alert-engine.ts";
import { normalizeSymbol } from "../../utils/symbols.ts";

export function alertCommand(priceBus: PriceBus) {
  return async (ctx: Context) => {
    const text = ctx.message?.text ?? "";
    const parts = text.split(/\s+/);

    // /alert <SYMBOL> <AMOUNT>
    if (parts.length < 3) {
      return ctx.reply("Usage: /alert <SYMBOL> <AMOUNT>\nExample: /alert ETH 10");
    }

    const rawSymbol = parts[1];
    const rawAmount = parts[2];

    // Normalize symbol (BTC → BTCUSDT)
    const symbol = normalizeSymbol(rawSymbol);

    // Validate symbol exists in price bus
    const lastPrice = priceBus.getLastPrice(symbol);
    if (!lastPrice) {
      return ctx.reply(
        `Symbol ${symbol} not found in active streams.\nUse /symbols <query> to search available symbols.`,
      );
    }

    // Validate amount
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) {
      return ctx.reply("Amount must be a positive number.\nExample: /alert ETH 10");
    }

    // Check decimal precision (max 5)
    const decimalPart = rawAmount.split(".")[1];
    if (decimalPart && decimalPart.length > 5) {
      return ctx.reply("Maximum 5 decimal places supported.\nExample: /alert PEPE 0.00001");
    }

    // Create user if not exists
    const chatId = ctx.chat?.id.toString() ?? "";
    const username = ctx.from?.username;
    const user = findOrCreateUser(chatId, username);

    // Create alert with current price as anchor
    const anchorPrice = lastPrice.price;
    const alert = createAlert(user.id, "movement", {
      symbol,
      moveAmount: amount,
      anchorPrice,
    });

    // Register in engine's in-memory index
    registerAlert(alert);

    const priceStr = formatPrice(anchorPrice);
    return ctx.reply(
      `Movement alert #${alert.id} created\n` +
        `${symbol} — notify on $${rawAmount} move\n` +
        `Anchor: $${priceStr}`,
    );
  };
}

function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 5, maximumFractionDigits: 5 });
}
