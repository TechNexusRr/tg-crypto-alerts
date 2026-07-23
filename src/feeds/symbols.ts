// Hardcoded symbol list — 20 popular Binance USDT-M perpetuals.
// Future: dynamically subscribe to symbols that have active alerts.
export const WATCHED_SYMBOLS = [
  // Majors
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  // Large-cap alts
  "DOGEUSDT",
  "ADAUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "DOTUSDT",
  "TRXUSDT",
  "TONUSDT",
  "LTCUSDT",
  "BCHUSDT",
  "NEARUSDT",
  "ATOMUSDT",
  "UNIUSDT",
  "APTUSDT",
  "ARBUSDT",
  "OPUSDT",
  "RIFUSDT", // special request — low unit price (~$0.10), use small move amounts
  // TradFi perpetuals (Binance TRADIFI_PERPETUAL contracts).
  // Prices track the real-world asset ~1:1, so $-move alerts map to real dollars.
  // Note: stocks trade on market hours, so these feeds go quiet nights/weekends.
  "XAUUSDT", // Gold (per oz)
  "XAGUSDT", // Silver (per oz)
  "TSLAUSDT", // Tesla
  "NVDAUSDT", // Nvidia
];
