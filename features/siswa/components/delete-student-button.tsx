'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteStudentAction } from '@/features/siswa/siswa.actions';

export function DeleteStudentButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Hapus data siswa "${name}"? Aksi ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteStudentAction(id);
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