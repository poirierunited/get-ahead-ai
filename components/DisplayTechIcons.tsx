'use client';

import { useEffect, useState } from 'react';
import { cn, normalizeTechName } from '@/lib/utils';

interface TechIconProps {
  techStack: string[];
}

// Predefined color palette for tech tags (inspired by Reddit's tag colors)
const tagColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-lime-500',
];

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className='flex justify-center'>
        <div className='flex -space-x-1'>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className='h-4 w-12 bg-gray-200 rounded-full animate-pulse'
            />
          ))}
          <div className='w-4 h-4 bg-gray-200 rounded-full animate-pulse' />
        </div>
      </div>
    );
  }

  // Process tech stack to get normalized names and limit to first 6 characters
  const processedTechs = techStack.map((tech, index) => {
    const normalized = normalizeTechName(tech);
    return {
      original: tech,
      normalized: normalized || tech,
      display: (normalized || tech).slice(0, 6).toUpperCase(),
      color: tagColors[index % tagColors.length], // Cycle through colors
    };
  });

  const visibleTechs = processedTechs.slice(0, 3);
  const remainingCount = Math.max(0, processedTechs.length - 3);
  const remainingTechs = processedTechs.slice(3);

  return (
    <div className='flex justify-center items-center'>
      <div className='flex -space-x-1'>
        {visibleTechs.map(({ original, display, color }) => (
          <div
            key={original}
            className={cn(
              'relative group px-2 py-0 rounded-full text-white text-[9px] font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default border border-white/20 dark:border-white/20 z-10 flex items-center justify-center min-w-[2rem] h-4',
              color
            )}
          >
            <span className='tech-tooltip'>{original}</span>

            <span className='leading-none flex items-center justify-center'>
              {display}
            </span>
          </div>
        ))}

        {remainingCount > 0 && (
          <div className='relative group tech-count-circle rounded-full flex items-center justify-center border border-light-400/20 dark:border-white/20 z-20 w-4 h-4 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default'>
            <span className='tech-tooltip'>
              {remainingTechs.map((tech) => tech.original).join(', ')}
            </span>

            <span className='text-[9px] font-medium leading-none flex items-center justify-center'>
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayTechIcons;
