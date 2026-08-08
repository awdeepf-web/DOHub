import Link from 'next/link';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { redirect } from 'next/navigation';
import { paymentService } from '@/services/payment.service';
import { PaymentTable } from '@/features/pembayaran/components/payment-table';
import { PaymentFilter } from '@/features/pembayaran/components/payment-filter';
import { PaginationControls } from '@/features/siswa/components/pagination-controls';
import { buttonVariants } from '@/components/ui/button';
import type { PaymentCategory, PaymentStatus } from '@/types/database.types';

const PAGE_SIZE = 10;

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams: { category?: string; status?: string; page?: string };
}) {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'payment:manage')) {
    redirect('/dashboard');
  }

  const page = Number(searchParams.page ?? '1') || 1;
  const category = (searchParams.category ?? '') as PaymentCategory | '';
  const status = (searchParams.status ?? '') as PaymentStatus | '';

  const { data, total } = await paymentService.list(profile.organization_id, {
    category: category || undefined,
    status: status || undefined,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pembayaran</h1>
          <p className="text-sm text-muted-foreground">Total {total} transaksi</p>
        </div>
        <Link href="/dashboard/pembayaran/tambah" className={buttonVariants({ variant: 'default' })}>
          + Tambah Pembayaran
        </Link>
      </div>

      <PaymentFilter defaultCategory={category} defaultStatus={status} />
      <PaymentTable payments={data} />
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
}