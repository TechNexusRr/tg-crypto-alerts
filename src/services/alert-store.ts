import { eq, and, count } from "drizzle-orm";
import { db } from "../db/client.ts";
import { alerts, alertEvents } from "../db/schema.ts";

export type Alert = typeof alerts.$inferSelect;
export type AlertEvent = typeof alertEvents.$inferSelect;

export function createAlert(userId: number, type: string, data: object): Alert {
  const alert = db
    .insert(alerts)
    .values({ userId, type, data })
    .returning()
    .get();

  logEvent(alert.id, userId, "created", { alert: { id: alert.id, type, ...data } });

  return alert;
}

export function getActiveAlertsBySymbol(symbol: string): Alert[] {
  // Get all active alerts and filter by symbol in JSON data
  const active = db
    .select()
    .from(alerts)
    .where(eq(alerts.isActive, true))
    .all();

  return active.filter((a) => {
    const d = a.data as { symbol?: string };
    return d.symbol === symbol;
  });
}

export function getActiveAlertsByUser(userId: number): Alert[] {
  return db
    .select()
    .from(alerts)
    .where(and(eq(alerts.userId, userId), eq(alerts.isActive, true)))
    .all();
}

export function getActiveAlertCount(): number {
  const result = db.select({ count: count() }).from(alerts).where(eq(alerts.isActive, true)).get();
  return result?.count ?? 0;
}

export function getAlertById(alertId: number): Alert | undefined {
  return db.select().from(alerts).where(eq(alerts.id, alertId)).get();
}

export function updateAlertData(alertId: number, data: object): void {
  db.update(alerts).set({ data }).where(eq(alerts.id, alertId)).run();
}

export function deactivateAlert(alertId: number): void {
  db.update(alerts).set({ isActive: false }).where(eq(alerts.id, alertId)).run();
}

export function deactivateAllForUser(userId: number): Alert[] {
  const active = getActiveAlertsByUser(userId);
  for (const alert of active) {
    deactivateAlert(alert.id);
  }
  return active;
}

export function logEvent(
  alertId: number,
  userId: number,
  type: string,
  snapshot: object,
): void {
  db.insert(alertEvents)
    .values({ alertId, userId, type, snapshot })
    .run();
}
