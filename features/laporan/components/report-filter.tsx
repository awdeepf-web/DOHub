'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ReportFilter({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="max-w-xs space-y-2">
      <Label htmlFor="month">Pilih Periode</Label>
      <Input
        id="month"
        type="month"
        defaultValue={defaultMonth}
        onChange={(e) => {
          if (e.target.value) {
            router.push(`${pathname}?month=${e.target.value}`);
          }
        }}
      />
    </div>
  );
}