import { formatCurrency } from '@/utils/payment';
import type { BreakdownItem } from '@/features/laporan/laporan.types';

export function BreakdownTable({ title, items }: { title: string; items: BreakdownItem[] }) {
  if (items.length === 0) {
    return (
      <div>
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Belum ada data di periode ini.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {item.label} <span className="text-muted-foreground">({item.count})</span>
              </span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}