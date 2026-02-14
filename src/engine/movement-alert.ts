import type { Alert } from "../services/alert-store.ts";

interface MovementData {
  symbol: string;
  moveAmount: number;
  anchorPrice: number;
}

export interface MovementResult {
  triggered: boolean;
  direction: "up" | "down";
  triggerPrice: number;
}

export function evaluateMovement(alert: Alert, currentPrice: number): MovementResult | null {
  const data = alert.data as MovementData;
  const diff = currentPrice - data.anchorPrice;

  if (Math.abs(diff) >= data.moveAmount) {
    return {
      triggered: true,
      direction: diff > 0 ? "up" : "down",
      triggerPrice: currentPrice,
    };
  }

  return null;
}
