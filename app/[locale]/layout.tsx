import '../globals.css';
import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Clara',
  description:
    'Plataforma de preparación para mercado laboral impulsado por Inteligencia Artificial',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className='dark'>
      <body className={`${monaSans.className} antialiased pattern`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
