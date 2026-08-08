'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteClassAction } from '@/features/kelas/kelas.actions';

export function DeleteClassButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Hapus kelas "${name}"? Data siswa yang terdaftar di kelas ini juga akan ikut terhapus dari kelas.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteClassAction(id);
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