import Link from 'next/link';
import { requireProfile } from '@/utils/guard';
import { studentService } from '@/services/student.service';
import { StudentTable } from '@/features/siswa/components/student-table';
import { StudentFilter } from '@/features/siswa/components/student-filter';
import { PaginationControls } from '@/features/siswa/components/pagination-controls';
import { buttonVariants } from '@/components/ui/button';
import { hasPermission } from '@/utils/rbac';
import type { Student } from '@/types/database.types';

const PAGE_SIZE = 10;

export default async function SiswaPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string };
}) {
  const profile = await requireProfile();
  const page = Number(searchParams.page ?? '1') || 1;
  const search = searchParams.search ?? '';
  const status = (searchParams.status ?? '') as Student['status'] | '';

  const { data, total } = await studentService.list(profile.organization_id, {
    search: search || undefined,
    status: status || undefined,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canManage = hasPermission(profile.role, 'student:manage');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">Total {total} siswa terdaftar</p>
        </div>
        {canManage && (
          <Link href="/dashboard/siswa/tambah" className={buttonVariants({ variant: 'default' })}>
            + Tambah Siswa
          </Link>
        )}
      </div>

      <StudentFilter defaultSearch={search} defaultStatus={status} />
      <StudentTable students={data} role={profile.role} />
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
}