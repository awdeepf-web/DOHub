import { Users, GraduationCap, BookOpen, AlertTriangle, Wallet } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ClassRepository } from '@/repositories/class.repository';
import { dashboardAnalyticsService } from '@/services/dashboard-analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLE_LABELS } from '@/utils/rbac';
import { formatCurrency, formatDateID } from '@/utils/payment';

function BreakdownBar({ items }: { items: { label: string; count: number; percentage: number }[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data.</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{item.label}</span>
            <span className="text-muted-foreground">{item.count}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const profile = await authService.getCurrentProfile();
  const supabase = createClient();

  const orgRepository = new OrganizationRepository(supabase);
  const studentRepository = new StudentRepository(supabase);
  const teacherRepository = new TeacherRepository(supabase);
  const classRepository = new ClassRepository(supabase);

  const organization = profile ? await orgRepository.findById(profile.organization_id) : null;

  const [studentResult, teacherResult, classResult, classBreakdown, teacherBreakdown, worstAttendance, topOutstanding] =
    profile
      ? await Promise.all([
          studentRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
          teacherRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
          classRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
          dashboardAnalyticsService.getClassStatusBreakdown(profile.organization_id),
          dashboardAnalyticsService.getTeacherStatusBreakdown(profile.organization_id),
          dashboardAnalyticsService.getWorstAttendance(profile.organization_id),
          dashboardAnalyticsService.getTopOutstandingInvoices(profile.organization_id),
        ])
      : [{ total: 0 }, { total: 0 }, { total: 0 }, [], [], [], []];

  const stats = [
    { label: 'Total Siswa', value: studentResult.total, icon: Users, accent: 'bg-blue-500/10 text-blue-600' },
    { label: 'Total Guru', value: teacherResult.total, icon: GraduationCap, accent: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Total Kelas', value: classResult.total, icon: BookOpen, accent: 'bg-amber-500/10 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {profile?.full_name ?? 'Pengguna'} 👋</h1>
        <p className="text-muted-foreground">
          {organization?.name ?? 'Bimbel kamu'} — Role: {profile ? ROLE_LABELS[profile.role] : '-'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kelas per Status</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBar items={classBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guru per Status</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBar items={teacherBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base">Absensi Terparah (30 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            {worstAttendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada siswa dengan catatan Alpha.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {worstAttendance.map((row) => (
                  <li key={row.studentNis} className="flex items-center justify-between">
                    <span>
                      {row.studentName} <span className="text-xs text-muted-foreground">({row.studentNis})</span>
                    </span>
                    <span className="font-medium text-destructive">{row.alphaCount}x Alpha</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <Wallet className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base">Tagihan Menunggak Terbesar</CardTitle>
          </CardHeader>
          <CardContent>
            {topOutstanding.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada tagihan menunggak. 🎉</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {topOutstanding.map((row) => (
                  <li key={row.invoiceNumber} className="flex items-center justify-between">
                    <span>
                      {row.studentName}{' '}
                      <span className="text-xs text-muted-foreground">
                        (jatuh tempo {formatDateID(row.dueDate)})
                      </span>
                    </span>
                    <span className="font-medium text-destructive">{formatCurrency(row.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}