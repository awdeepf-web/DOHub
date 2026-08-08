'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deletePaymentAction } from '@/features/pembayaran/pembayaran.actions';

export function DeletePaymentButton({ id, label }: { id: string; label: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus data pembayaran "${label}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deletePaymentAction(id);
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