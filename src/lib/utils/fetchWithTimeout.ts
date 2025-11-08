export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
}

/**
 * Helper para aplicar timeout em fetch de forma compativel
 * com navegadores que ainda nao suportam AbortSignal.timeout.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 5000, signal, ...rest } = options;

  if (typeof AbortController === 'undefined' || timeout <= 0) {
    return fetch(input, { signal, ...rest });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    return await fetch(input, { ...rest, signal: controller.signal });
  } finally {
    cleanup();
  }
}
