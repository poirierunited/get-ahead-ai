// Can be imported from a shared config
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

// Simple configuration for next-intl v4
export const defaultLocale = "en";
