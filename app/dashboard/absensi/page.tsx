import { redirect } from 'next/navigation';
import { TrendingUp, TrendingDown, Minus, UserCheck, UserX, School } from 'lucide-react';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { attendanceService } from '@/services/attendance.service';
import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { ClassDatePicker } from '@/features/absensi/components/class-date-picker';
import { AttendanceHistoryTable } from '@/features/absensi/components/attendance-history-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const [{ data: history }, overview] = await Promise.all([
    attendanceService.listHistory(profile.organization_id, {}),
    attendanceService.getTodayOverview(profile.organization_id),
  ]);

  const TrendIcon = overview.trendPoints > 0 ? TrendingUp : overview.trendPoints < 0 ? TrendingDown : Minus;
  const trendColor =
    overview.trendPoints > 0
      ? 'text-emerald-600'
      : overview.trendPoints < 0
        ? 'text-destructive'
        : 'text-muted-foreground';

  const stats = [
    {
      label: 'Kehadiran Hari Ini',
      value: `${overview.attendancePercentage}%`,
      icon: TrendIcon,
      accent: 'bg-blue-500/10 text-blue-600',
      footer: (
        <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {overview.trendPoints === 0
            ? 'Sama seperti kemarin'
            : `${overview.trendPoints > 0 ? '+' : ''}${overview.trendPoints} poin vs kemarin`}
        </span>
      ),
    },
    {
      label: 'Siswa Hadir',
      value: overview.totalHadir,
      icon: UserCheck,
      accent: 'bg-emerald-500/10 text-emerald-600',
      footer: <span className="text-xs text-muted-foreground">Tercatat hari ini</span>,
    },
    {
      label: 'Izin / Sakit',
      value: overview.totalIzinSakit,
      icon: UserX,
      accent: 'bg-amber-500/10 text-amber-600',
      footer: <span className="text-xs text-muted-foreground">Tercatat hari ini</span>,
    },
    {
      label: 'Kelas Aktif Hari Ini',
      value: overview.activeClassesToday,
      icon: School,
      accent: 'bg-violet-500/10 text-violet-600',
      footer: <span className="text-xs text-muted-foreground">Sudah diabsen</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Absensi</h1>
        <p className="text-sm text-muted-foreground">Pilih kelas dan tanggal untuk mengambil absensi</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                {stat.footer}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ClassDatePicker classOptions={classOptions} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Riwayat Absensi Terakhir</h2>
        <AttendanceHistoryTable rows={history} />
      </div>
    </div>
  );
}