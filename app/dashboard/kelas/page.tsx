import Link from 'next/link';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { classService } from '@/services/class.service';
import { ClassTable } from '@/features/kelas/components/class-table';
import { PaginationControls } from '@/features/siswa/components/pagination-controls';
import { buttonVariants } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default async function KelasPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const profile = await requireProfile();
  const page = Number(searchParams.page ?? '1') || 1;

  const { data, total } = await classService.list(profile.organization_id, { page });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canManage = hasPermission(profile.role, 'class:manage');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Kelas</h1>
          <p className="text-sm text-muted-foreground">Total {total} kelas</p>
        </div>
        {canManage && (
          <Link href="/dashboard/kelas/tambah" className={buttonVariants({ variant: 'default' })}>
            + Tambah Kelas
          </Link>
        )}
      </div>

      <ClassTable classes={data} canManage={canManage} />
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
}