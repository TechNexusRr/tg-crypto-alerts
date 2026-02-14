import { logger } from "./logger.ts";

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  label?: string;
}

export async function retry<T>(
  fn: () => T | Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = Infinity,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    jitter = true,
    label = "retry",
  } = opts;

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        logger.error({ label, attempt, err }, "Max retries exceeded");
        throw err;
      }

      const expDelay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const delay = jitter
        ? expDelay * (0.5 + Math.random() * 0.5)
        : expDelay;

      logger.warn(
        { label, attempt, delayMs: Math.round(delay) },
        "Retrying after failure",
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
