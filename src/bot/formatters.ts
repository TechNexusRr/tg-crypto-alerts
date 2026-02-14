import type { Alert } from "../services/alert-store.ts";

export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 5, maximumFractionDigits: 5 });
}

export function formatAlertList(alertList: Alert[]): string {
  if (alertList.length === 0) {
    return "No active alerts. Use /alert to create one.";
  }

  let msg = "Active Alerts:\n\n";
  for (const alert of alertList) {
    const data = alert.data as { symbol: string; moveAmount: number; anchorPrice: number };
    msg += `#${alert.id} — ${data.symbol} | $${data.moveAmount} move | anchor: $${formatPrice(data.anchorPrice)}\n`;
  }
  return msg;
}
