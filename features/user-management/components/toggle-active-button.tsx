'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toggleUserActiveAction } from '@/features/user-management/user-management.actions';

export function ToggleActiveButton({
  profileId,
  isActive,
  disabled,
  userName,
}: {
  profileId: string;
  isActive: boolean;
  disabled: boolean;
  userName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    const action = isActive ? 'menonaktifkan' : 'mengaktifkan';
    const confirmed = window.confirm(`Yakin ingin ${action} akun "${userName}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await toggleUserActiveAction(profileId, !isActive);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={isActive ? 'destructive' : 'default'}
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isPending}
    >
      {isPending ? 'Memproses...' : isActive ? 'Nonaktifkan' : 'Aktifkan'}
    </Button>
  );
}