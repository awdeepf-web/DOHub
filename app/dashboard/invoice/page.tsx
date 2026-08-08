import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { invoiceService } from '@/services/invoice.service';
import { InvoiceTable } from '@/features/invoice/components/invoice-table';
import { PaginationControls } from '@/features/siswa/components/pagination-controls';
import { buttonVariants } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default async function InvoicePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'invoice:manage')) {
    redirect('/dashboard');
  }

  const page = Number(searchParams.page ?? '1') || 1;
  const { data, total } = await invoiceService.list(profile.organization_id, { page });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-sm text-muted-foreground">Total {total} invoice</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/invoice/generate" className={buttonVariants({ variant: 'outline' })}>
            Generate Massal
          </Link>
          <Link href="/dashboard/invoice/tambah" className={buttonVariants({ variant: 'default' })}>
            + Tambah Invoice
          </Link>
        </div>
      </div>

      <InvoiceTable invoices={data} />
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
}