import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { reportService } from '@/services/report.service';
import { getCurrentMonthValue } from '@/utils/report';
import { ReportFilter } from '@/features/laporan/components/report-filter';
import { SummaryCards } from '@/features/laporan/components/summary-cards';
import { BreakdownTable } from '@/features/laporan/components/breakdown-table';
import { OutstandingInvoicesTable } from '@/features/laporan/components/outstanding-invoices-table';

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'report:view')) {
    redirect('/dashboard');
  }

  const month = searchParams.month ?? getCurrentMonthValue();

  const [summary, outstandingInvoices] = await Promise.all([
    reportService.getFinancialSummary(profile.organization_id, month),
    reportService.getOutstandingInvoices(profile.organization_id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-sm text-muted-foreground">Ringkasan pemasukan dan tagihan bimbel</p>
      </div>

      <ReportFilter defaultMonth={month} />

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <BreakdownTable title="Pemasukan per Kategori" items={summary.categoryBreakdown} />
        <BreakdownTable title="Pemasukan per Metode Pembayaran" items={summary.methodBreakdown} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Semua Tagihan Belum Lunas</h2>
        <OutstandingInvoicesTable rows={outstandingInvoices} />
      </div>
    </div>
  );
}