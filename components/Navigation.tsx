'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';

export function Navigation() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3 group'>
          <div className='logo-container'>
            <Image
              src='/ai-woman.png'
              alt='Sarah Logo'
              width={38}
              height={32}
              className='transition-transform duration-200 group-hover:scale-105'
            />
          </div>
          <h2 className='header-title'>Project Sarah</h2>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
          <div className='w-20 h-8 bg-gray-200 rounded animate-pulse' />
        </div>
      </nav>
    );
  }

  return (
    <nav className='flex items-center justify-between p-4'>
      <Link href={`/${locale}`} className='flex items-center gap-3 group'>
        <div className='logo-container'>
          <Image
            src='/ai-woman.png'
            alt='Sarah Logo'
            width={38}
            height={32}
            className='transition-transform duration-200 group-hover:scale-105'
          />
        </div>
        <h2 className='header-title'>Project Sarah</h2>
      </Link>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </nav>
  );
}
