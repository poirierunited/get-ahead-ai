import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className='flex w-full min-h-[60vh] items-center justify-center'>
      <div className='flex flex-col items-center gap-4 p-6 rounded-2xl border border-light-400/20 dark:border-white/10 shadow-sm bg-white/60 dark:bg-dark-dark-200/60 backdrop-blur-md'>
        <div className='relative w-10 h-10'>
          <span className='absolute inset-0 rounded-full border-4 border-light-200 dark:border-gray-600' />
          <span className='absolute inset-0 rounded-full border-4 border-transparent border-t-primary-100 dark:border-t-gray-300 animate-spin' />
        </div>
        {message ? (
          <p className='text-sm text-light-600 dark:text-dark-light-100'>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
