/**
 * Authentication constants
 */

// Cookie names
export const AUTH_COOKIES = {
  SESSION: "session",
} as const;

// Session duration (1 week in seconds)
export const SESSION_DURATION = 60 * 60 * 24 * 7;

// Cookie options
export const COOKIE_OPTIONS = {
  maxAge: SESSION_DURATION,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
} as const;
