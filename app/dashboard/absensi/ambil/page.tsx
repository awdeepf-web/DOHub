import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { attendanceService } from '@/services/attendance.service';
import { AttendanceForm } from '@/features/absensi/components/attendance-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AmbilAbsensiPage({
  searchParams,
}: {
  searchParams: { classId?: string; date?: string };
}) {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'attendance:manage')) {
    redirect('/dashboard');
  }

  const { classId, date } = searchParams;

  if (!classId || !date) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Silakan pilih kelas dan tanggal terlebih dahulu dari halaman Absensi.
        </p>
        <Link href="/dashboard/absensi" className="text-sm font-medium text-primary underline underline-offset-4">
          Kembali ke halaman Absensi
        </Link>
      </div>
    );
  }

  const sessionData = await attendanceService.getSessionData(profile.organization_id, classId, date);

  if (!sessionData) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Kelas tidak ditemukan.</p>
        <Link href="/dashboard/absensi" className="text-sm font-medium text-primary underline underline-offset-4">
          Kembali ke halaman Absensi
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Absensi — {sessionData.className} ({formattedDate})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttendanceForm
          classId={sessionData.classId}
          date={sessionData.date}
          className={sessionData.className}
          students={sessionData.students}
          initialSessionNotes={sessionData.sessionNotes}
        />
      </CardContent>
    </Card>
  );
}