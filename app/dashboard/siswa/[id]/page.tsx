import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { studentService } from '@/services/student.service';
import { StudentForm } from '@/features/siswa/components/student-form';
import { updateStudentAction } from '@/features/siswa/siswa.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditSiswaPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'student:manage')) {
    redirect('/dashboard/siswa');
  }

  const student = await studentService.getById(params.id);
  if (!student || student.organization_id !== profile.organization_id) {
    notFound();
  }

  const boundAction = updateStudentAction.bind(null, student.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Data Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentForm student={student} action={boundAction} />
      </CardContent>
    </Card>
  );
}