'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { upgradeToProAction, downgradeToFreeAction } from '@/features/upgrade/upgrade.actions';

export function UpgradeButton({ currentPlan }: { currentPlan: 'free' | 'pro' }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpgrade() {
    startTransition(async () => {
      const result = await upgradeToProAction();
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDowngrade() {
    const confirmed = window.confirm('Turunkan kembali ke paket Free? Fitur Pro akan dinonaktifkan.');
    if (!confirmed) return;
    startTransition(async () => {
      const result = await downgradeToFreeAction();
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (currentPlan === 'pro') {
    return (
      <Button type="button" variant="outline" onClick={handleDowngrade} disabled={isPending}>
        {isPending ? 'Memproses...' : 'Turunkan ke Free (testing)'}
      </Button>
    );
  }

  return (
    <Button type="button" onClick={handleUpgrade} disabled={isPending} className="w-full">
      {isPending ? 'Memproses...' : 'Upgrade ke Pro Sekarang'}
    </Button>
  );
}