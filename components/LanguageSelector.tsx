"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { currentLocale, changeLanguage, locales } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <div className="flex gap-1">
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "outline"}
            size="sm"
            onClick={() => changeLanguage(locale)}
            className="min-w-[40px] h-8 text-xs"
          >
            {locale.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
