export interface RetryOptions {
  retries: number;
  minDelayMs: number;
  maxDelayMs: number;
  factor: number;
  jitterRatio: number; // 0..1
  isRetryable?: (err: unknown) => boolean;
  onRetry?: (info: { attempt: number; delayMs: number; error: unknown }) => void;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function jitteredDelay(baseDelayMs: number, jitterRatio: number) {
  const jitter = Math.max(0, Math.min(1, jitterRatio));
  const delta = baseDelayMs * jitter;
  const min = baseDelayMs - delta;
  const max = baseDelayMs + delta;
  return Math.floor(min + Math.random() * (max - min));
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const retries = Math.max(0, options.retries);
  const minDelayMs = Math.max(0, options.minDelayMs);
  const maxDelayMs = Math.max(minDelayMs, options.maxDelayMs);
  const factor = options.factor <= 1 ? 2 : options.factor;
  const jitterRatio = options.jitterRatio;
  const isRetryable = options.isRetryable ?? (() => true);

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isRetryable(err)) {
        throw err;
      }

      const baseDelayMs = Math.min(maxDelayMs, Math.floor(minDelayMs * Math.pow(factor, attempt)));
      const delayMs = jitteredDelay(baseDelayMs, jitterRatio);
      attempt += 1;
      options.onRetry?.({ attempt, delayMs, error: err });
      await sleep(delayMs);
    }
  }
}

