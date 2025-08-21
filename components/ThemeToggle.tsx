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
      <div className='w-10 h-10 bg-light-100 rounded-full animate-pulse' />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className='relative w-10 h-10 bg-light-100 hover:bg-light-200 dark:bg-dark-200 dark:hover:bg-dark-300 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border border-light-400/20 dark:border-white/10 group'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={`w-5 h-5 transition-all duration-200 ${
          theme === 'light'
            ? 'text-yellow-500 scale-100 rotate-0'
            : 'text-light-400 scale-0 -rotate-90'
        }`}
      />
      <Moon
        className={`absolute w-5 h-5 transition-all duration-200 ${
          theme === 'dark'
            ? 'text-blue-400 scale-100 rotate-0'
            : 'text-light-400 scale-0 rotate-90'
        }`}
      />

      {/* Ripple effect */}
      <span className='absolute inset-0 rounded-full bg-primary-100/0 group-hover:bg-primary-100/10 transition-all duration-200' />
    </button>
  );
}
