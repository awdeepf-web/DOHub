import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { StudentForm } from '@/features/siswa/components/student-form';
import { createStudentAction } from '@/features/siswa/siswa.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahSiswaPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'student:manage')) {
    redirect('/dashboard/siswa');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Siswa Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentForm action={createStudentAction} />
      </CardContent>
    </Card>
  );
}