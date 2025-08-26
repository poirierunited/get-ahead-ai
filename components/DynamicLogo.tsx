'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface DynamicLogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export function DynamicLogo({
  width = 38,
  height = 32,
  alt = 'Clara Logo',
  className = '',
}: DynamicLogoProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light mode image during SSR
  const logoSrc =
    mounted && theme === 'dark'
      ? '/ai-woman-brunette.png'
      : '/ai-woman-blonde.png';

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
    />
  );
}
