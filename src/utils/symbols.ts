const QUOTE_CURRENCIES = ["USDT", "USDC", "BTC", "ETH", "EUR", "BNB"];

export function normalizeSymbol(input: string): string {
  const upper = input.trim().toUpperCase();
  const hasQuote = QUOTE_CURRENCIES.some((q) => upper.endsWith(q));
  return hasQuote ? upper : `${upper}USDT`;
}
