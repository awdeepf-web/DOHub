'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function StudentFilter({
  defaultSearch,
  defaultStatus,
}: {
  defaultSearch: string;
  defaultStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(defaultSearch);
  const [, startTransition] = useTransition();

  function updateParams(next: { search?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search) params.set('search', next.search);
      else params.delete('search');
    }

    if (next.status !== undefined) {
      if (next.status) params.set('status', next.status);
      else params.delete('status');
    }

    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        placeholder="Cari nama atau NIS..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') updateParams({ search });
        }}
        onBlur={() => updateParams({ search })}
        className="md:max-w-xs"
      />
      <Select
        defaultValue={defaultStatus}
        onChange={(event) => updateParams({ status: event.target.value })}
        className="md:max-w-[180px]"
      >
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="inactive">Tidak Aktif</option>
      </Select>
    </div>
  );
}