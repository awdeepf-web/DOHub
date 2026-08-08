import { notFound } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { classService } from '@/services/class.service';
import { createClient } from '@/services/supabase/server';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { ClassForm } from '@/features/kelas/components/class-form';
import { ClassStudentEnrollment } from '@/features/kelas/components/class-student-enrollment';
import { updateClassAction } from '@/features/kelas/kelas.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DetailKelasPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  const canManage = hasPermission(profile.role, 'class:manage');

  const klass = await classService.getById(params.id);
  if (!klass || klass.organization_id !== profile.organization_id) {
    notFound();
  }

  const supabase = createClient();
  const teacherRepository = new TeacherRepository(supabase);
  const profileRepository = new ProfileRepository(supabase);
  const studentRepository = new StudentRepository(supabase);

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

  const enrolledStudents = await classService.getEnrolledStudents(klass.id);
  const enrolledIds = new Set(enrolledStudents.map((student) => student.studentId));

  const { data: allStudents } = await studentRepository.list({
    organizationId: profile.organization_id,
    status: 'active',
    pageSize: 500,
  });
  const availableStudents = allStudents
    .filter((student) => !enrolledIds.has(student.id))
    .map((student) => ({ id: student.id, fullName: student.full_name, nis: student.nis }));

  const boundAction = updateClassAction.bind(null, klass.id);

  return (
    <div className="space-y-6">
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Data Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassForm klass={klass} teacherOptions={teacherOptions} action={boundAction} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Siswa di Kelas Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassStudentEnrollment
            classId={klass.id}
            enrolledStudents={enrolledStudents}
            availableStudents={availableStudents}
            canManage={canManage}
          />
        </CardContent>
      </Card>
    </div>
  );
}