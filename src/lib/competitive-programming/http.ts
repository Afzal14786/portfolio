interface UpstreamRequestOptions {
  revalidateSeconds?: number;
  headers?: Record<string, string>;
}

const DEFAULT_REVALIDATION_SECONDS = 30 * 60;
const REQUEST_TIMEOUT_MS = 12_000;

const DEFAULT_HEADERS = {
  Accept: "application/json, text/html;q=0.9, */*;q=0.8",
  "User-Agent": "Mozilla/5.0 (compatible; AfzalPortfolio/1.0)",
};

export async function fetchJson<T>(
  url: string,
  options: UpstreamRequestOptions = {},
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),

    // Cache successful upstream responses to avoid querying platforms
    // on every portfolio page visit.
    next: {
      revalidate: options.revalidateSeconds ?? DEFAULT_REVALIDATION_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function fetchText(
  url: string,
  options: UpstreamRequestOptions = {},
): Promise<string> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: {
      revalidate: options.revalidateSeconds ?? DEFAULT_REVALIDATION_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}.`);
  }

  return response.text();
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value.replaceAll(",", "").trim());

  return Number.isFinite(parsed) ? parsed : null;
}

export function asString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

export function toIsoDate(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    // Contest APIs commonly return Unix timestamps in seconds.
    const milliseconds = value < 1_000_000_000_000 ? value * 1000 : value;
    const date = new Date(milliseconds);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const normalized = value.trim();

  // Numeric timestamp strings are also supported.
  if (/^\d{10,13}$/.test(normalized)) {
    return toIsoDate(Number(normalized));
  }

  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function maximumOrNull(values: number[]): number | null {
  return values.length > 0 ? Math.max(...values) : null;
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
