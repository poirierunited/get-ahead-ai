'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='w-10 h-10 bg-light-100 dark:bg-dark-200 rounded-full animate-pulse' />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className='relative w-10 h-10 bg-white dark:bg-dark-dark-200 hover:bg-light-100 dark:hover:bg-dark-dark-300 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-none border border-light-400/30 dark:border-white/10 group overflow-hidden'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background gradient for active state */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === 'light'
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50'
            : 'bg-gradient-to-br from-slate-700/20 to-slate-800/20'
        }`}
      />

      {/* Sun icon */}
      <Sun
        className={`relative w-5 h-5 transition-all duration-300 ${
          theme === 'light'
            ? 'text-yellow-500 scale-110 drop-shadow-sm'
            : 'text-light-400 scale-0 -rotate-90 opacity-0'
        }`}
      />

      {/* Moon icon */}
      <Moon
        className={`absolute w-5 h-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'text-slate-300 scale-110 drop-shadow-sm'
            : 'text-light-400 scale-0 rotate-90 opacity-0'
        }`}
      />

      {/* Subtle ring effect on hover */}
      <div className='absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-primary-100/30 dark:group-hover:ring-slate-400/20 transition-all duration-300' />

      {/* Active state pulse effect */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === 'light'
            ? 'bg-yellow-400/20 scale-0 group-hover:scale-100'
            : 'bg-slate-400/15 scale-0 group-hover:scale-100'
        }`}
      />

      {/* Ripple effect on click */}
      <span className='absolute inset-0 rounded-full bg-primary-100/0 group-active:bg-primary-100/20 dark:group-active:bg-slate-400/20 transition-all duration-200' />
    </button>
  );
}
