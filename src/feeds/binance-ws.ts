import { logger } from "../utils/logger.ts";
import { retry } from "../utils/retry.ts";
import type { PriceUpdate, FeedHealth } from "./types.ts";
import { WATCHED_SYMBOLS } from "./symbols.ts";

// Binance USDT-M Futures combined stream
const streams = WATCHED_SYMBOLS.map((s) => `${s.toLowerCase()}@miniTicker`).join("/");
const BINANCE_WS_URL = `wss://fstream.binance.com/stream?streams=${streams}`;

interface BinanceMiniTicker {
  s: string; // symbol
  c: string; // close price
}

export function startBinanceFeed(
  onPrice: (update: PriceUpdate) => void,
): { close: () => void; getHealth: () => FeedHealth } {
  let ws: WebSocket | null = null;
  let connected = false;
  let lastMessageAt: number | null = null;
  let reconnectCount = 0;
  let closed = false;

  function connect() {
    ws = new WebSocket(BINANCE_WS_URL);

    ws.addEventListener("open", () => {
      connected = true;
      logger.info({ symbols: WATCHED_SYMBOLS.length }, "Binance Futures WS connected");
    });

    ws.addEventListener("message", (event) => {
      lastMessageAt = Date.now();
      try {
        // Combined stream wraps data in { stream, data }
        const msg = JSON.parse(event.data as string) as {
          stream: string;
          data: BinanceMiniTicker;
        };
        const t = msg.data;
        onPrice({
          symbol: t.s,
          price: parseFloat(t.c),
          source: "binance",
          timestamp: Date.now(),
        });
      } catch (err) {
        logger.error({ err }, "Binance WS parse error");
      }
    });

    ws.addEventListener("close", () => {
      connected = false;
      if (!closed) {
        logger.warn("Binance WS disconnected, reconnecting...");
        scheduleReconnect();
      }
    });

    ws.addEventListener("error", (err) => {
      logger.error({ err }, "Binance WS error");
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
            reject(new Error("Binance WS connection failed"));
          };
          currentWs.addEventListener("open", onOpen, { once: true });
          currentWs.addEventListener("error", onError, { once: true });
        }),
      {
        baseDelayMs: 1000,
        maxDelayMs: 30000,
        label: "binance-ws-reconnect",
      },
    ).catch((err) => {
      logger.error({ err }, "Binance WS reconnect gave up");
    });
  }

  connect();

  return {
    close: () => {
      closed = true;
      ws?.close();
    },
    getHealth: () => ({ connected, lastMessageAt, reconnectCount }),
  };
}
