'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { auth } from '@/firebase/client';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { signOut as serverSignOut } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { logger, LogCategory } from '@/lib/logger';

export function SignOutButton() {
  const router = useRouter();
  const locale = useLocale();
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');

  const handleSignOut = async () => {
    try {
      // Best-effort client sign-out
      try {
        await firebaseSignOut(auth);
      } catch (_) {}

      // Clear session cookie on server
      await serverSignOut();

      // Redirect to login
      toast.success(`${tNav('signOut')} - ${tCommon('success')}`);
      router.push(`/${locale}/sign-in`);
    } catch (error) {
      logger.error('Sign out error', {
        category: LogCategory.AUTH_FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        locale,
      });
      toast.error(`${tNav('signOut')} - ${tCommon('error')}`);
    }
  };

  return (
    <button
      type='button'
      onClick={handleSignOut}
      title={tNav('signOut')}
      aria-label={tNav('signOut')}
      className='relative group w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-light-100 dark:hover:bg-dark-dark-300 border border-light-400/30 dark:border-white/10'
    >
      <span className='tech-tooltip'>{tNav('signOut')}</span>
      <LogOut className='w-4 h-4' />
    </button>
  );
}
