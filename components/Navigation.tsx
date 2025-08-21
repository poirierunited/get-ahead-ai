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
        <div className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='MockMate Logo' width={38} height={32} />
          <h2 className='text-primary-100'>Project Sarah</h2>
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
      <Link href={`/${locale}`} className='flex items-center gap-2'>
        <Image src='/logo.svg' alt='MockMate Logo' width={38} height={32} />
        <h2 className='text-primary-100'>Project Sarah</h2>
      </Link>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </nav>
  );
}
