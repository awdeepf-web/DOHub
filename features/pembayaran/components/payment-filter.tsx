'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { PAYMENT_CATEGORY_OPTIONS, PAYMENT_STATUS_OPTIONS } from '@/utils/payment';

export function PaymentFilter({
  defaultCategory,
  defaultStatus,
}: {
  defaultCategory: string;
  defaultStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(next: { category?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.category !== undefined) {
      if (next.category) params.set('category', next.category);
      else params.delete('category');
    }
    if (next.status !== undefined) {
      if (next.status) params.set('status', next.status);
      else params.delete('status');
    }
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Select
        defaultValue={defaultCategory}
        onChange={(e) => updateParams({ category: e.target.value })}
        className="md:max-w-[200px]"
      >
        <option value="">Semua Kategori</option>
        {PAYMENT_CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        defaultValue={defaultStatus}
        onChange={(e) => updateParams({ status: e.target.value })}
        className="md:max-w-[200px]"
      >
        <option value="">Semua Status</option>
        {PAYMENT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}