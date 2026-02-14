import { logger } from "../utils/logger.ts";
import type { PriceBus } from "../feeds/price-bus.ts";
import type { PriceUpdate } from "../feeds/types.ts";
import {
  type Alert,
  getActiveAlertsBySymbol,
  updateAlertData,
  logEvent,
} from "../services/alert-store.ts";
import { evaluateMovement } from "./movement-alert.ts";
import { queueNotification } from "../services/notifier.ts";
import { db } from "../db/client.ts";
import { alerts, users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

// In-memory index: symbol → active alerts
const alertsBySymbol = new Map<string, Alert[]>();

export function startAlertEngine(priceBus: PriceBus): void {
  // Load all active alerts from DB and index by symbol
  const allActive = db
    .select()
    .from(alerts)
    .where(eq(alerts.isActive, true))
    .all();

  for (const alert of allActive) {
    const data = alert.data as { symbol: string };
    addToIndex(data.symbol, alert);
  }

  logger.info({ alertCount: allActive.length }, "Alert engine started");

  priceBus.subscribe((update) => onPrice(update));
}

function onPrice(update: PriceUpdate): void {
  const symbolAlerts = alertsBySymbol.get(update.symbol);
  if (!symbolAlerts || symbolAlerts.length === 0) return;

  for (const alert of symbolAlerts) {
    if (alert.type === "movement") {
      const result = evaluateMovement(alert, update.price);
      if (result) {
        const data = alert.data as { symbol: string; moveAmount: number; anchorPrice: number };
        const prevAnchor = data.anchorPrice;

        // Log triggered event with full snapshot
        logEvent(alert.id, alert.userId, "triggered", {
          alert: { id: alert.id, type: alert.type, ...data },
          price: update.price,
          direction: result.direction,
          source: update.source,
        });

        // Re-anchor to trigger price
        const newData = { ...data, anchorPrice: update.price };
        updateAlertData(alert.id, newData);
        alert.data = newData;

        // Send notification
        const dir = result.direction === "up" ? "UP" : "DOWN";
        const msg =
          `${data.symbol} moved ${dir} $${data.moveAmount}\n` +
          `Price: $${formatPrice(update.price)}\n` +
          `Previous anchor: $${formatPrice(prevAnchor)}\n` +
          `New anchor: $${formatPrice(update.price)}`;

        // Look up user chatId
        const user = db.select().from(users).where(eq(users.id, alert.userId)).get();
        if (user) {
          queueNotification(user.chatId, msg);
        }

        logger.info(
          { alertId: alert.id, symbol: data.symbol, direction: result.direction, price: update.price },
          "Alert triggered",
        );
      }
    }
  }
}

function addToIndex(symbol: string, alert: Alert): void {
  let list = alertsBySymbol.get(symbol);
  if (!list) {
    list = [];
    alertsBySymbol.set(symbol, list);
  }
  list.push(alert);
}

export function registerAlert(alert: Alert): void {
  const data = alert.data as { symbol: string };
  addToIndex(data.symbol, alert);
}

export function unregisterAlert(alertId: number): void {
  for (const [symbol, list] of alertsBySymbol) {
    const idx = list.findIndex((a) => a.id === alertId);
    if (idx !== -1) {
      list.splice(idx, 1);
      if (list.length === 0) alertsBySymbol.delete(symbol);
      return;
    }
  }
}

export function updateEngineAlert(alertId: number, newData: object): void {
  for (const list of alertsBySymbol.values()) {
    const alert = list.find((a) => a.id === alertId);
    if (alert) {
      alert.data = newData;
      return;
    }
  }
}

function formatPrice(price: number): string {
  // Use enough decimals to be meaningful
  if (price >= 1) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 5, maximumFractionDigits: 5 });
}
