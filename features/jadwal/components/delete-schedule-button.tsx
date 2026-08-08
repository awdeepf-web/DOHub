'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteScheduleAction } from '@/features/jadwal/jadwal.actions';

export function DeleteScheduleButton({ id, label }: { id: string; label: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus jadwal "${label}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteScheduleAction(id);
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