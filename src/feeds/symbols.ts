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
  // TradFi symbols (gold, silver, Tesla, Nvidia) are Binance FUTURES-only
  // (TRADIFI_PERPETUAL contracts). The feed here uses Binance's SPOT public data
  // domain (data-stream.binance.vision) because this host's IP is blocked from
  // Binance's futures/main WS. Spot carries no stock/metal symbols, so these are
  // disabled. Re-enable ONLY if the feed can reach Binance futures again
  // (e.g. a proxy/VPN egress on the host) — otherwise they produce no data.
  // "XAUUSDT", "XAGUSDT", "TSLAUSDT", "NVDAUSDT",
];
