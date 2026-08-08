import Link from 'next/link';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { scheduleService } from '@/services/schedule.service';
import { ScheduleTable } from '@/features/jadwal/components/schedule-table';
import { buttonVariants } from '@/components/ui/button';

export default async function JadwalPage() {
  const profile = await requireProfile();
  const schedules = await scheduleService.list(profile.organization_id);
  const canManage = hasPermission(profile.role, 'schedule:manage');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jadwal Kelas</h1>
          <p className="text-sm text-muted-foreground">Total {schedules.length} jadwal terdaftar</p>
        </div>
        {canManage && (
          <Link href="/dashboard/jadwal/tambah" className={buttonVariants({ variant: 'default' })}>
            + Tambah Jadwal
          </Link>
        )}
      </div>

      <ScheduleTable schedules={schedules} canManage={canManage} />
    </div>
  );
}