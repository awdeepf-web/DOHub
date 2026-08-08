import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { attendanceService } from '@/services/attendance.service';
import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { ClassDatePicker } from '@/features/absensi/components/class-date-picker';
import { AttendanceHistoryTable } from '@/features/absensi/components/attendance-history-table';

export default async function AbsensiPage() {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'attendance:manage')) {
    redirect('/dashboard');
  }

  const supabase = createClient();
  const classRepository = new ClassRepository(supabase);
  const { data: classes } = await classRepository.list({
    organizationId: profile.organization_id,
    pageSize: 100,
  });
  const classOptions = classes.map((klass) => ({ id: klass.id, name: klass.name }));

  const { data: history } = await attendanceService.listHistory(profile.organization_id, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Absensi</h1>
        <p className="text-sm text-muted-foreground">Pilih kelas dan tanggal untuk mengambil absensi</p>
      </div>

      <ClassDatePicker classOptions={classOptions} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Riwayat Absensi Terakhir</h2>
        <AttendanceHistoryTable rows={history} />
      </div>
    </div>
  );
}