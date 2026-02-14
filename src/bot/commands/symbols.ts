import type { Context } from "grammy";
import type { PriceBus } from "../../feeds/price-bus.ts";

export function symbolsCommand(priceBus: PriceBus) {
  return (ctx: Context) => {
    const text = ctx.message?.text ?? "";
    const parts = text.split(/\s+/);

    if (parts.length < 2) {
      return ctx.reply("Usage: /symbols <query>\nExample: /symbols btc");
    }

    const query = parts[1];
    const results = priceBus.searchSymbols(query);

    if (results.length === 0) {
      return ctx.reply(`No symbols matching '${query}'.\nTry /symbols btc`);
    }

    let msg = `Symbols matching "${query}":\n\n`;
    for (const r of results) {
      msg += `${r.symbol} — ${r.sources.join(", ")}\n`;
    }
    msg += `\n(${results.length} match${results.length === 1 ? "" : "es"})`;

    return ctx.reply(msg);
  };
}
