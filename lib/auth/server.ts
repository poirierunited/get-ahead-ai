import 'server-only';
import type { NextRequest } from 'next/server';
import { auth } from '@/firebase/admin';

/**
 * Extracts a Firebase ID token from the Authorization header (Bearer scheme).
 * Returns null if not present or malformed.
 */
export function getBearerToken(req: NextRequest): string | null {
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;
  return token;
}

/**
 * Verifies the Firebase ID token (if present) and returns the user ID (uid).
 * Returns null if no token is present or verification fails.
 */
export async function getUserIdFromRequest(
  req: NextRequest
): Promise<string | null> {
  const token = getBearerToken(req);
  if (!token) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid ?? null;
  } catch {
    return null;
  }
}
