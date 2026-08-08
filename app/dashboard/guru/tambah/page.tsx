import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { TeacherForm } from '@/features/guru/components/teacher-form';
import { createTeacherAction } from '@/features/guru/guru.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahGuruPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'teacher:manage')) {
    redirect('/dashboard/guru');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Guru Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <TeacherForm action={createTeacherAction} />
      </CardContent>
    </Card>
  );
}