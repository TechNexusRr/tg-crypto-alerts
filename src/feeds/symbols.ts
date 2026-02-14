// Hardcoded symbol list — scoped to 10 popular USDT perpetuals for now.
// Future: dynamically subscribe to symbols that have active alerts.
export const WATCHED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "PEPEUSDT",
  "XAUTUSDT",
];

// Bybit uses different symbol names for some perpetuals.
// Map our canonical symbol → Bybit linear symbol.
export const BYBIT_SYMBOL_MAP: Record<string, string> = {
  PEPEUSDT: "1000PEPEUSDT",
};

// Reverse map: Bybit symbol → our canonical symbol
export const BYBIT_SYMBOL_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(BYBIT_SYMBOL_MAP).map(([k, v]) => [v, k]),
);
