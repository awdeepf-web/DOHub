import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'DOHub Bimbel Management System',
  description: 'Sistem manajemen bimbingan belajar multi-tenant',
};

// Script kecil ini jalan SEBELUM React hydrate, supaya tidak ada
// "kedipan" warna terang sekilas saat user sudah pilih mode gelap.
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}