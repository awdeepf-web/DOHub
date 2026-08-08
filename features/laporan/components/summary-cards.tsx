import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/payment';
import type { FinancialSummary } from '@/features/laporan/laporan.types';

export function SummaryCards({ summary }: { summary: FinancialSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Total Pemasukan — {summary.monthLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-sm text-muted-foreground">{summary.totalTransactions} transaksi</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tagihan Belum Lunas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-destructive">
            {formatCurrency(summary.totalOutstanding)}
          </p>
          <p className="text-sm text-muted-foreground">{summary.outstandingCount} invoice</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rata-rata per Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {formatCurrency(
              summary.totalTransactions > 0 ? summary.totalRevenue / summary.totalTransactions : 0,
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}