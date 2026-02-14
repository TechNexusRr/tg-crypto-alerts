import { Api } from "grammy";
import { config } from "../config.ts";
import { logger } from "../utils/logger.ts";

interface QueuedMessage {
  chatId: string;
  text: string;
}

const api = new Api(config.TELEGRAM_BOT_TOKEN);
const queue: QueuedMessage[] = [];
let draining = false;

export function queueNotification(chatId: string, text: string): void {
  queue.push({ chatId, text });
  if (!draining) drain();
}

async function drain(): Promise<void> {
  draining = true;
  while (queue.length > 0) {
    const msg = queue.shift()!;
    try {
      await api.sendMessage(msg.chatId, msg.text);
    } catch (err: unknown) {
      const status = (err as { error_code?: number }).error_code;
      if (status === 429) {
        const retryAfter = (err as { parameters?: { retry_after?: number } }).parameters?.retry_after ?? 5;
        logger.warn({ retryAfter }, "Telegram rate limited, backing off");
        queue.unshift(msg);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }
      logger.error({ err, chatId: msg.chatId }, "Failed to send notification");
    }
    // 1 msg/sec rate limit
    if (queue.length > 0) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  draining = false;
}
