import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { isAuthenticated } from '@/lib/actions/auth.action';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';

const AuthLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect(`/${locale}`);

  return (
    <div className='auth-layout'>
      <div className='absolute top-4 right-4 flex items-center gap-3'>
        <LanguageSelector />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
