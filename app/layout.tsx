import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontMono = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DOHub Bimbel Management System',
  description: 'Sistem manajemen bimbingan belajar multi-tenant',
};

const noFlashScript = `
(function() {
  try {
    var stored = localStorage.getItem('dohub-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <ThemeProvider>
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}