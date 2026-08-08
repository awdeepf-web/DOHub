'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Di production, baris ini bisa diganti kirim error ke layanan monitoring (Sentry, dll)
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="max-w-md text-muted-foreground">
            Maaf, ada masalah teknis yang tidak terduga. Tim kami akan segera memperbaikinya.
            Coba muat ulang halaman ini.
          </p>
          <Button onClick={reset}>Coba Lagi</Button>
        </main>
      </body>
    </html>
  );
}