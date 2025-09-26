'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ThemeToggle } from './ThemeToggle';
import { DynamicLogo } from './DynamicLogo';
import { useEffect, useState } from 'react';
import { SignOutButton } from './SignOutButton';

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
            <DynamicLogo
              alt='Clara Logo'
              width={32}
              height={32}
              className='transition-transform duration-200 group-hover:scale-105'
            />
          </div>
          <h2 className='header-title'>Project Clara</h2>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-20 h-8 bg-gray-200 rounded animate-pulse' />
          <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
        </div>
      </nav>
    );
  }

  return (
    <nav className='flex items-center justify-between p-4'>
      <Link href={`/${locale}`} className='flex items-center gap-3 group'>
        <div className='logo-container'>
          <DynamicLogo
            alt='Clara Logo'
            width={32}
            height={32}
            className='transition-transform duration-200 group-hover:scale-105'
          />
        </div>
        <h2 className='header-title'>Project Clara</h2>
      </Link>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        <SignOutButton />
      </div>
    </nav>
  );
}
