'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { markInvoicePaidAction } from '@/features/invoice/invoice.actions';

export function MarkPaidButton({ id, invoiceNumber }: { id: string; invoiceNumber: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMarkPaid() {
    const confirmed = window.confirm(
      `Tandai invoice "${invoiceNumber}" sebagai LUNAS? Ini akan otomatis mencatat pembayaran.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await markInvoicePaidAction(id);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="default" size="sm" onClick={handleMarkPaid} disabled={isPending}>
      {isPending ? 'Memproses...' : 'Tandai Lunas'}
    </Button>
  );
}