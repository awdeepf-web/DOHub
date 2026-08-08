import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { teacherService } from '@/services/teacher.service';
import { TeacherForm } from '@/features/guru/components/teacher-form';
import { updateTeacherAction } from '@/features/guru/guru.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditGuruPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'teacher:manage')) {
    redirect('/dashboard/guru');
  }

  const teacher = await teacherService.getById(params.id);
  if (!teacher || teacher.organization_id !== profile.organization_id) {
    notFound();
  }

  const boundAction = updateTeacherAction.bind(null, teacher.id, teacher.profile_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Data Guru</CardTitle>
      </CardHeader>
      <CardContent>
        <TeacherForm teacher={teacher} action={boundAction} />
      </CardContent>
    </Card>
  );
}