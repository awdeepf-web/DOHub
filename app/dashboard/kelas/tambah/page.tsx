import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { createClient } from '@/services/supabase/server';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import { ClassForm } from '@/features/kelas/components/class-form';
import { createClassAction } from '@/features/kelas/kelas.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahKelasPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'class:manage')) {
    redirect('/dashboard/kelas');
  }

  const supabase = createClient();
  const teacherRepository = new TeacherRepository(supabase);
  const profileRepository = new ProfileRepository(supabase);

  const { data: teachers } = await teacherRepository.list({
    organizationId: profile.organization_id,
    pageSize: 100,
  });
  const teacherProfiles = await profileRepository.findByIds(
    teachers.map((teacher) => teacher.profile_id),
  );
  const profileMap = new Map(teacherProfiles.map((p) => [p.id, p]));

  const teacherOptions = teachers.map((teacher) => ({
    id: teacher.id,
    fullName: profileMap.get(teacher.profile_id)?.full_name ?? '(tidak diketahui)',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Kelas Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <ClassForm teacherOptions={teacherOptions} action={createClassAction} />
      </CardContent>
    </Card>
  );
}