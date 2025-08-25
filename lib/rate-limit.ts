import 'server-only';
import type { NextRequest } from 'next/server';

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

// In-memory store for simplicity; replace with Redis for production
const ipToTimestamps = new Map<string, number[]>();

/**
 * Very basic IP-based rate limiter. For production, use a durable store.
 */
export function isRateLimited(req: NextRequest): boolean {
  const xff = req.headers.get('x-forwarded-for');
  const ip =
    (Array.isArray(xff) ? xff[0] : xff?.split(',')[0]) ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = ipToTimestamps.get(ip) ?? [];
  const recent = timestamps.filter((t) => t > windowStart);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  ipToTimestamps.set(ip, recent);
  return false;
}
