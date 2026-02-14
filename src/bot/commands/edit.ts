import type { Context } from "grammy";
import type { PriceBus } from "../../feeds/price-bus.ts";
import { findOrCreateUser } from "../../services/user-store.ts";
import { getAlertById, updateAlertData, logEvent } from "../../services/alert-store.ts";
import { updateEngineAlert } from "../../engine/alert-engine.ts";
import { formatPrice } from "../formatters.ts";

export function editCommand(priceBus: PriceBus) {
  return (ctx: Context) => {
    const text = ctx.message?.text ?? "";
    const parts = text.split(/\s+/);

    // /edit <id> <newAmount>
    if (parts.length < 3) {
      return ctx.reply("Usage: /edit <id> <newAmount>\nExample: /edit 3 15");
    }

    const chatId = ctx.chat?.id.toString() ?? "";
    const username = ctx.from?.username;
    const user = findOrCreateUser(chatId, username);

    const alertId = parseInt(parts[1], 10);
    if (isNaN(alertId)) {
      return ctx.reply("Usage: /edit <id> <newAmount>\nExample: /edit 3 15");
    }

    const alert = getAlertById(alertId);
    if (!alert || alert.userId !== user.id || !alert.isActive) {
      return ctx.reply(`Alert #${alertId} not found.`);
    }

    const rawAmount = parts[2];
    const newAmount = parseFloat(rawAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      return ctx.reply("Amount must be a positive number.");
    }

    const decimalPart = rawAmount.split(".")[1];
    if (decimalPart && decimalPart.length > 5) {
      return ctx.reply("Maximum 5 decimal places supported.");
    }

    const data = alert.data as { symbol: string; moveAmount: number; anchorPrice: number };

    // Get current price for the symbol
    const lastPrice = priceBus.getLastPrice(data.symbol);
    if (!lastPrice) {
      return ctx.reply(`No price data available for ${data.symbol}. Try again shortly.`);
    }

    const prevAmount = data.moveAmount;
    const prevAnchor = data.anchorPrice;
    const newAnchor = lastPrice.price;

    // Log edited event with previous values
    logEvent(alert.id, user.id, "edited", {
      alert: { id: alert.id, type: alert.type, symbol: data.symbol, moveAmount: newAmount, anchorPrice: newAnchor },
      previous: { moveAmount: prevAmount, anchorPrice: prevAnchor },
    });

    // Update in DB
    const newData = { symbol: data.symbol, moveAmount: newAmount, anchorPrice: newAnchor };
    updateAlertData(alertId, newData);

    // Update in engine's in-memory index
    updateEngineAlert(alertId, newData);

    return ctx.reply(
      `Alert #${alertId} updated\n` +
        `${data.symbol} — $${rawAmount} move from $${formatPrice(newAnchor)}\n` +
        `Was: $${prevAmount} from $${formatPrice(prevAnchor)}`,
    );
  };
}
