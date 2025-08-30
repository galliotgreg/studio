
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { Footer } from '@/components/app/Footer';
import { ThemeProvider } from '@/components/app/theme-provider';

export const metadata: Metadata = {
  title: 'Gratitude Challenge',
  description: 'A 30-day challenge to cultivate gratitude.',
};

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
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
              <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
