import type { Context } from "grammy";
import { findOrCreateUser } from "../../services/user-store.ts";
import {
  getAlertById,
  deactivateAlert,
  deactivateAllForUser,
  logEvent,
} from "../../services/alert-store.ts";
import { unregisterAlert } from "../../engine/alert-engine.ts";

export function dropCommand() {
  return (ctx: Context) => {
    const text = ctx.message?.text ?? "";
    const parts = text.split(/\s+/);

    if (parts.length < 2) {
      return ctx.reply("Usage: /drop <id> or /drop all");
    }

    const chatId = ctx.chat?.id.toString() ?? "";
    const username = ctx.from?.username;
    const user = findOrCreateUser(chatId, username);

    const arg = parts[1].toLowerCase();

    if (arg === "all") {
      const dropped = deactivateAllForUser(user.id);
      if (dropped.length === 0) {
        return ctx.reply("No active alerts to drop.");
      }
      for (const alert of dropped) {
        const data = alert.data as { symbol: string; moveAmount: number; anchorPrice: number };
        logEvent(alert.id, user.id, "dropped", {
          alert: { id: alert.id, type: alert.type, ...data },
        });
        unregisterAlert(alert.id);
      }
      return ctx.reply(`Dropped ${dropped.length} alert(s).`);
    }

    // Single drop by ID
    const alertId = parseInt(arg, 10);
    if (isNaN(alertId)) {
      return ctx.reply("Usage: /drop <id> or /drop all\nExample: /drop 3");
    }

    const alert = getAlertById(alertId);
    if (!alert || alert.userId !== user.id || !alert.isActive) {
      return ctx.reply(`Alert #${alertId} not found.`);
    }

    const data = alert.data as { symbol: string; moveAmount: number; anchorPrice: number };
    deactivateAlert(alertId);
    logEvent(alert.id, user.id, "dropped", {
      alert: { id: alert.id, type: alert.type, ...data },
    });
    unregisterAlert(alertId);

    return ctx.reply(`Alert #${alertId} dropped.`);
  };
}
