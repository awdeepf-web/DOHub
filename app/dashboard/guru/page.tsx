import Link from 'next/link';
import { requireProfile } from '@/utils/guard';
import { redirect } from 'next/navigation';
import { hasPermission } from '@/utils/rbac';
import { teacherService } from '@/services/teacher.service';
import { TeacherTable } from '@/features/guru/components/teacher-table';
import { PaginationControls } from '@/features/siswa/components/pagination-controls';
import { buttonVariants } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default async function GuruPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'teacher:manage') && profile.role !== 'guru') {
    redirect('/dashboard');
  }

  const page = Number(searchParams.page ?? '1') || 1;
  const { data, total } = await teacherService.list(profile.organization_id, { page });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canManage = hasPermission(profile.role, 'teacher:manage');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Guru</h1>
          <p className="text-sm text-muted-foreground">Total {total} guru terdaftar</p>
        </div>
        {canManage && (
          <Link href="/dashboard/guru/tambah" className={buttonVariants({ variant: 'default' })}>
            + Tambah Guru
          </Link>
        )}
      </div>

      <TeacherTable teachers={data} />
      <PaginationControls page={page} totalPages={totalPages} />
    </div>
  );
}