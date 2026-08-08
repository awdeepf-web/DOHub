'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-bold">Halaman Ini Bermasalah</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Terjadi kesalahan saat memuat halaman ini. Coba muat ulang, atau kembali ke Dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          Coba Lagi
        </Button>
        <Link href="/dashboard" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
}