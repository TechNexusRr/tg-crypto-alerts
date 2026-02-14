import type { PriceUpdate } from "./types.ts";

type PriceHandler = (update: PriceUpdate) => void;

export class PriceBus {
  private handlers: PriceHandler[] = [];
  private lastPrices = new Map<string, PriceUpdate>();
  private lastPricesBySource = new Map<string, PriceUpdate>();
  private symbolSources = new Map<string, Set<string>>();

  publish(update: PriceUpdate): void {
    this.lastPrices.set(update.symbol, update);
    this.lastPricesBySource.set(`${update.symbol}:${update.source}`, update);

    let sources = this.symbolSources.get(update.symbol);
    if (!sources) {
      sources = new Set();
      this.symbolSources.set(update.symbol, sources);
    }
    sources.add(update.source);

    for (const handler of this.handlers) {
      handler(update);
    }
  }

  subscribe(handler: PriceHandler): void {
    this.handlers.push(handler);
  }

  getLastPrice(symbol: string): PriceUpdate | undefined {
    return this.lastPrices.get(symbol);
  }

  getLastPriceBySource(symbol: string, source: string): PriceUpdate | undefined {
    return this.lastPricesBySource.get(`${symbol}:${source}`);
  }

  getKnownSymbols(): Map<string, Set<string>> {
    return this.symbolSources;
  }

  searchSymbols(query: string): Array<{ symbol: string; sources: string[] }> {
    const q = query.toUpperCase();
    const results: Array<{ symbol: string; sources: string[] }> = [];

    for (const [symbol, sources] of this.symbolSources) {
      if (symbol.includes(q)) {
        results.push({ symbol, sources: [...sources].sort() });
      }
    }

    return results.sort((a, b) => a.symbol.localeCompare(b.symbol)).slice(0, 20);
  }
}
