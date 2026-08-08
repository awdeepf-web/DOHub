'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { unenrollStudentAction } from '@/features/kelas/kelas.actions';

export function RemoveStudentFromClassButton({
  classId,
  enrollmentId,
  studentName,
}: {
  classId: string;
  enrollmentId: string;
  studentName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRemove() {
    const confirmed = window.confirm(`Keluarkan "${studentName}" dari kelas ini?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await unenrollStudentAction(classId, enrollmentId);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={isPending}>
      {isPending ? 'Memproses...' : 'Keluarkan'}
    </Button>
  );
}