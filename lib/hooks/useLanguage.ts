'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { logger, LogCategory } from '@/lib/logger';

export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>('en');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect browser language and handle locale logic only after mounting
  useEffect(() => {
    if (!mounted) return;

    const browserLang = navigator.language.split('-')[0];
    const detectedLocale = locales.includes(browserLang as any)
      ? browserLang
      : 'en';

    logger.debug('User browser language detected', {
      category: LogCategory.CLIENT_ACTION,
      browserLang,
      detectedLocale,
    });

    // Extract locale from current path
    const pathLocale = pathname.split('/')[1];
    if (locales.includes(pathLocale as any)) {
      setCurrentLocale(pathLocale);
    } else {
      // If current path doesn't have locale, redirect to detected locale
      const newPath =
        pathname === '/'
          ? `/${detectedLocale}`
          : `/${detectedLocale}${pathname}`;
      router.replace(newPath);
      setCurrentLocale(detectedLocale);
    }
  }, [pathname, router, mounted]);

  const changeLanguage = (newLocale: string) => {
    if (locales.includes(newLocale as any)) {
      const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
      const newPath = `/${newLocale}${currentPath}`;
      router.push(newPath);
      setCurrentLocale(newLocale);
    }
  };

  // Return safe values during SSR
  if (!mounted) {
    return {
      currentLocale: 'en', // Default fallback
      changeLanguage: () => {}, // No-op function
      locales,
    };
  }

  return {
    currentLocale,
    changeLanguage,
    locales,
  };
}
