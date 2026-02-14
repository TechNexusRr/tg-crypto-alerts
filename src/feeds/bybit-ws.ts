import { logger } from "../utils/logger.ts";
import { retry } from "../utils/retry.ts";
import type { PriceUpdate, FeedHealth } from "./types.ts";
import { WATCHED_SYMBOLS, BYBIT_SYMBOL_MAP, BYBIT_SYMBOL_REVERSE } from "./symbols.ts";

// Bybit v5 linear (USDT perpetuals)
const BYBIT_WS_URL = "wss://stream.bybit.com/v5/public/linear";

export function startBybitFeed(
  onPrice: (update: PriceUpdate) => void,
): { close: () => void; getHealth: () => FeedHealth } {
  let ws: WebSocket | null = null;
  let connected = false;
  let lastMessageAt: number | null = null;
  let reconnectCount = 0;
  let closed = false;
  let pingInterval: ReturnType<typeof setInterval> | null = null;

  function connect() {
    ws = new WebSocket(BYBIT_WS_URL);

    ws.addEventListener("open", () => {
      connected = true;
      logger.info({ symbols: WATCHED_SYMBOLS.length }, "Bybit Linear WS connected");

      // Subscribe one symbol at a time to avoid one bad symbol killing the batch.
      // Use Bybit-specific symbol names where they differ (e.g. 1000PEPEUSDT).
      for (const s of WATCHED_SYMBOLS) {
        const bybitSymbol = BYBIT_SYMBOL_MAP[s] ?? s;
        ws!.send(JSON.stringify({ op: "subscribe", args: [`tickers.${bybitSymbol}`] }));
      }

      // Bybit requires ping every 20s to keep alive
      pingInterval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ op: "ping" }));
        }
      }, 20_000);
    });

    ws.addEventListener("message", (event) => {
      lastMessageAt = Date.now();
      try {
        const msg = JSON.parse(event.data as string) as {
          op?: string;
          success?: boolean;
          ret_msg?: string;
          topic?: string;
          type?: string;
          data?: { symbol: string; lastPrice?: string };
        };

        // Log failed subscriptions as warnings
        if (msg.op === "subscribe" && msg.success === false) {
          logger.warn({ ret_msg: msg.ret_msg }, "Bybit subscription failed");
          return;
        }

        // Ignore pong and successful subscription confirmations
        if (msg.op) return;

        // Only emit when lastPrice is present (snapshots always have it,
        // deltas include it only when the last traded price changed)
        if (msg.topic?.startsWith("tickers.") && msg.data?.lastPrice) {
          // Map Bybit symbol back to canonical name (e.g. 1000PEPEUSDT → PEPEUSDT)
          const canonical = BYBIT_SYMBOL_REVERSE[msg.data.symbol] ?? msg.data.symbol;
          onPrice({
            symbol: canonical,
            price: parseFloat(msg.data.lastPrice),
            source: "bybit",
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        logger.error({ err }, "Bybit WS parse error");
      }
    });

    ws.addEventListener("close", () => {
      connected = false;
      if (pingInterval) clearInterval(pingInterval);
      if (!closed) {
        logger.warn("Bybit WS disconnected, reconnecting...");
        scheduleReconnect();
      }
    });

    ws.addEventListener("error", (err) => {
      logger.error({ err }, "Bybit WS error");
    });
  }

  function scheduleReconnect() {
    reconnectCount++;
    retry(
      () =>
        new Promise<void>((resolve, reject) => {
          connect();
          const currentWs = ws!;
          const onOpen = () => {
            currentWs.removeEventListener("error", onError);
            resolve();
          };
          const onError = () => {
            currentWs.removeEventListener("open", onOpen);
            reject(new Error("Bybit WS connection failed"));
          };
          currentWs.addEventListener("open", onOpen, { once: true });
          currentWs.addEventListener("error", onError, { once: true });
        }),
      {
        baseDelayMs: 1000,
        maxDelayMs: 30000,
        label: "bybit-ws-reconnect",
      },
    ).catch((err) => {
      logger.error({ err }, "Bybit WS reconnect gave up");
    });
  }

  connect();

  return {
    close: () => {
      closed = true;
      if (pingInterval) clearInterval(pingInterval);
      ws?.close();
    },
    getHealth: () => ({ connected, lastMessageAt, reconnectCount }),
  };
}
