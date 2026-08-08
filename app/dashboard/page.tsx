import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ClassRepository } from '@/repositories/class.repository';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLE_LABELS } from '@/utils/rbac';

export default async function DashboardPage() {
  const profile = await authService.getCurrentProfile();
  const supabase = createClient();

  const orgRepository = new OrganizationRepository(supabase);
  const studentRepository = new StudentRepository(supabase);
  const teacherRepository = new TeacherRepository(supabase);
  const classRepository = new ClassRepository(supabase);

  const organization = profile ? await orgRepository.findById(profile.organization_id) : null;

  const [studentResult, teacherResult, classResult] = profile
    ? await Promise.all([
        studentRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
        teacherRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
        classRepository.list({ organizationId: profile.organization_id, pageSize: 1 }),
      ])
    : [{ total: 0 }, { total: 0 }, { total: 0 }];

  const stats = [
    {
      label: 'Total Siswa',
      value: studentResult.total,
      icon: Users,
      accent: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Total Guru',
      value: teacherResult.total,
      icon: GraduationCap,
      accent: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      label: 'Total Kelas',
      value: classResult.total,
      icon: BookOpen,
      accent: 'bg-amber-500/10 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {profile?.full_name ?? 'Pengguna'} 👋
        </h1>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
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
    </div>
  );
}