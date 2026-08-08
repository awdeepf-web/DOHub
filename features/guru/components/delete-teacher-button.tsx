'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteTeacherAction } from '@/features/guru/guru.actions';

export function DeleteTeacherButton({
  teacherId,
  profileId,
  name,
}: {
  teacherId: string;
  profileId: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Hapus data guru "${name}"? Akun login guru ini juga akan dinonaktifkan.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteTeacherAction(teacherId, profileId);
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