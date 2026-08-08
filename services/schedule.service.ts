import { createClient } from '@/services/supabase/server';
import { ClassScheduleRepository } from '@/repositories/class-schedule.repository';
import { ClassRepository } from '@/repositories/class.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import type { ScheduleInput } from '@/features/jadwal/jadwal.validation';
import type { ScheduleWithClass } from '@/features/jadwal/jadwal.types';
import type { ClassSchedule } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class ScheduleService {
  async list(organizationId: string): Promise<ScheduleWithClass[]> {
    const supabase = createClient();
    const scheduleRepository = new ClassScheduleRepository(supabase);
    const classRepository = new ClassRepository(supabase);
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);

    const schedules = await scheduleRepository.listByOrganization(organizationId);

    const classIds = [...new Set(schedules.map((schedule) => schedule.class_id))];
    const classes = await Promise.all(classIds.map((id) => classRepository.findById(id)));
    const classMap = new Map(
      classes
        .filter((klass): klass is NonNullable<typeof klass> => Boolean(klass))
        .map((klass) => [klass.id, klass]),
    );

    const teacherIds = [...classMap.values()]
      .map((klass) => klass.teacher_id)
      .filter((id): id is string => Boolean(id));
    const teachers = await Promise.all(teacherIds.map((id) => teacherRepository.findById(id)));
    const validTeachers = teachers.filter((teacher): teacher is NonNullable<typeof teacher> =>
      Boolean(teacher),
    );
    const teacherProfiles = await profileRepository.findByIds(
      validTeachers.map((teacher) => teacher.profile_id),
    );
    const profileMap = new Map(teacherProfiles.map((profile) => [profile.id, profile]));
    const teacherNameByClassId = new Map<string, string>();
    for (const klass of classMap.values()) {
      if (!klass.teacher_id) continue;
      const teacher = validTeachers.find((t) => t.id === klass.teacher_id);
      if (teacher) {
        teacherNameByClassId.set(
          klass.id,
          profileMap.get(teacher.profile_id)?.full_name ?? '(tidak diketahui)',
        );
      }
    }

    return schedules.map((schedule) => ({
      ...schedule,
      class_name: classMap.get(schedule.class_id)?.name ?? '(kelas terhapus)',
      teacher_name: teacherNameByClassId.get(schedule.class_id) ?? null,
    }));
  }

  async getById(id: string): Promise<ClassSchedule | null> {
    const supabase = createClient();
    const scheduleRepository = new ClassScheduleRepository(supabase);
    return scheduleRepository.findById(id);
  }

  private async checkConflict(
    organizationId: string,
    classId: string,
    input: ScheduleInput,
    excludeId?: string,
  ): Promise<string | null> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    const scheduleRepository = new ClassScheduleRepository(supabase);

    const klass = await classRepository.findById(classId);
    if (!klass?.teacher_id) return null;

    const teacherClasses = await classRepository.findByTeacher(organizationId, klass.teacher_id);
    const teacherClassIds = teacherClasses.map((c) => c.id);

    const conflicts = await scheduleRepository.findConflicting({
      organizationId,
      teacherClassIds,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      excludeId,
    });

    if (conflicts.length > 0) {
      return 'Perhatian: guru pengampu kelas ini sudah punya jadwal lain yang bentrok di hari & jam yang sama.';
    }

    return null;
  }

  async create(
    organizationId: string,
    input: ScheduleInput,
  ): Promise<{ error: string | null; warning: string | null }> {
    const supabase = createClient();
    const scheduleRepository = new ClassScheduleRepository(supabase);

    const warning = await this.checkConflict(organizationId, input.classId, input);

    try {
      await scheduleRepository.create({
        organization_id: organizationId,
        class_id: input.classId,
        day_of_week: input.dayOfWeek,
        start_time: input.startTime,
        end_time: input.endTime,
        room: toNullable(input.room),
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null, warning };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal menyimpan jadwal',
        warning: null,
      };
    }
  }

  async update(
    id: string,
    organizationId: string,
    input: ScheduleInput,
  ): Promise<{ error: string | null; warning: string | null }> {
    const supabase = createClient();
    const scheduleRepository = new ClassScheduleRepository(supabase);

    const warning = await this.checkConflict(organizationId, input.classId, input, id);

    try {
      await scheduleRepository.update(id, {
        class_id: input.classId,
        day_of_week: input.dayOfWeek,
        start_time: input.startTime,
        end_time: input.endTime,
        room: toNullable(input.room),
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null, warning };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal memperbarui jadwal',
        warning: null,
      };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const scheduleRepository = new ClassScheduleRepository(supabase);
    try {
      await scheduleRepository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus jadwal' };
    }
  }
}

export const scheduleService = new ScheduleService();