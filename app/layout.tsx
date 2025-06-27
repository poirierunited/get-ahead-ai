import './globals.css';
import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Get Ahead Project',
  description:
    'Plataforma de preparación para mercado laboral impulsado por Inteligencia Artificial',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
