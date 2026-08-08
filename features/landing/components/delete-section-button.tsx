'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteSectionAction } from '@/features/landing/landing.actions';

export function DeleteSectionButton({ id, heading }: { id: string; heading: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus konten "${heading}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteSectionAction(id);
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