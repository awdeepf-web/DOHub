import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { ClassStudentRepository } from '@/repositories/class-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import { StudentRepository } from '@/repositories/student.repository';
import type { ClassInput } from '@/features/kelas/kelas.validation';
import type { ClassWithTeacher, EnrolledStudentRow } from '@/features/kelas/kelas.types';
import type { Class } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class ClassService {
  async list(
    organizationId: string,
    params: { page?: number },
  ): Promise<{ data: ClassWithTeacher[]; total: number }> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);
    const classStudentRepository = new ClassStudentRepository(supabase);

    const { data: classes, total } = await classRepository.list({
      organizationId,
      page: params.page,
    });

    const teacherIds = classes
      .map((klass) => klass.teacher_id)
      .filter((id): id is string => Boolean(id));

    const teachers = await Promise.all(teacherIds.map((id) => teacherRepository.findById(id)));
    const validTeachers = teachers.filter((teacher): teacher is NonNullable<typeof teacher> =>
      Boolean(teacher),
    );
    const teacherProfileIds = validTeachers.map((teacher) => teacher.profile_id);
    const teacherProfiles = await profileRepository.findByIds(teacherProfileIds);
    const profileMap = new Map(teacherProfiles.map((profile) => [profile.id, profile]));
    const teacherNameMap = new Map(
      validTeachers.map((teacher) => [
        teacher.id,
        profileMap.get(teacher.profile_id)?.full_name ?? '(tidak diketahui)',
      ]),
    );

    const merged: ClassWithTeacher[] = await Promise.all(
      classes.map(async (klass) => ({
        ...klass,
        teacher_name: klass.teacher_id ? teacherNameMap.get(klass.teacher_id) ?? null : null,
        enrolled_count: await classStudentRepository.countByClass(klass.id),
      })),
    );

    return { data: merged, total };
  }

  async getById(id: string): Promise<Class | null> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    return classRepository.findById(id);
  }

  async getEnrolledStudents(classId: string): Promise<EnrolledStudentRow[]> {
    const supabase = createClient();
    const classStudentRepository = new ClassStudentRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const enrollments = await classStudentRepository.findByClass(classId);
    const rows = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await studentRepository.findById(enrollment.student_id);
        return {
          enrollmentId: enrollment.id,
          studentId: enrollment.student_id,
          fullName: student?.full_name ?? '(siswa terhapus)',
          nis: student?.nis ?? '-',
        };
      }),
    );

    return rows;
  }

  async create(organizationId: string, input: ClassInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);

    try {
      await classRepository.create({
        organization_id: organizationId,
        teacher_id: toNullable(input.teacherId),
        name: input.name,
        subject: toNullable(input.subject),
        capacity: input.capacity,
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan data kelas' };
    }
  }

  async update(id: string, input: ClassInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);

    try {
      await classRepository.update(id, {
        teacher_id: toNullable(input.teacherId),
        name: input.name,
        subject: toNullable(input.subject),
        capacity: input.capacity,
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui data kelas' };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    try {
      await classRepository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus data kelas' };
    }
  }

  async enrollStudent(
    organizationId: string,
    classId: string,
    studentId: string,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    const classStudentRepository = new ClassStudentRepository(supabase);

    const klass = await classRepository.findById(classId);
    if (!klass) {
      return { error: 'Kelas tidak ditemukan' };
    }

    const alreadyEnrolled = await classStudentRepository.isEnrolled(classId, studentId);
    if (alreadyEnrolled) {
      return { error: 'Siswa ini sudah terdaftar di kelas ini' };
    }

    const currentCount = await classStudentRepository.countByClass(classId);
    if (currentCount >= klass.capacity) {
      return { error: `Kelas sudah penuh (kapasitas ${klass.capacity} siswa)` };
    }

    try {
      await classStudentRepository.enroll({
        organization_id: organizationId,
        class_id: classId,
        student_id: studentId,
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menambahkan siswa ke kelas' };
    }
  }

  async unenrollStudent(enrollmentId: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const classStudentRepository = new ClassStudentRepository(supabase);
    try {
      await classStudentRepository.unenroll(enrollmentId);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal mengeluarkan siswa dari kelas' };
    }
  }
}

export const classService = new ClassService();