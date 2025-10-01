import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/shared/header';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-provider';

export const metadata: Metadata = {
  title: 'Farming Expert',
  description: 'AI-powered query support & advisory system for farmers.',
};

const THEMES = [
  'light',
  'dark',
  'forest',
  'dark-forest',
  'sky',
  'dark-sky',
  'rose',
  'dark-rose',
  'ocean',
  'dark-ocean',
  'sunset',
  'dark-sunset',
  'lavender',
  'dark-lavender',
  'sunflower',
  'dark-sunflower',
  'cosmic',
  'dark-cosmic',
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          themes={THEMES}
        >
          <LanguageProvider>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
