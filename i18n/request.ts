import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "../i18n";

export default getRequestConfig(async ({ locale }) => {
  console.log("getRequestConfig called with locale:", locale);

  // If no locale is provided, use the default locale
  const resolvedLocale = locale || defaultLocale;
  console.log("resolvedLocale:", resolvedLocale);

  // Validate that the incoming `locale` parameter is valid
  if (!resolvedLocale || !locales.includes(resolvedLocale as any)) {
    throw new Error(`Locale '${resolvedLocale}' is not supported`);
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
