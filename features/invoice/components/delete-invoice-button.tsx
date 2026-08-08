'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteInvoiceAction } from '@/features/invoice/invoice.actions';

export function DeleteInvoiceButton({ id, invoiceNumber }: { id: string; invoiceNumber: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus invoice "${invoiceNumber}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteInvoiceAction(id);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Menghapus...' : 'Hapus'}
    </Button>
  );
}