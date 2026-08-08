import { createClient } from '@/services/supabase/server';
import { AttendanceSessionRepository } from '@/repositories/attendance-session.repository';
import { AttendanceRecordRepository } from '@/repositories/attendance-record.repository';
import { ClassRepository } from '@/repositories/class.repository';
import { ClassStudentRepository } from '@/repositories/class-student.repository';
import { StudentRepository } from '@/repositories/student.repository';
import type { AttendanceStatus } from '@/types/database.types';
import type { AttendanceHistoryRow, AttendanceStudentRow } from '@/features/absensi/absensi.types';

export interface AttendanceSessionData {
  classId: string;
  className: string;
  date: string;
  sessionNotes: string;
  students: AttendanceStudentRow[];
}

export class AttendanceService {
  async getSessionData(
    organizationId: string,
    classId: string,
    date: string,
  ): Promise<AttendanceSessionData | null> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    const classStudentRepository = new ClassStudentRepository(supabase);
    const studentRepository = new StudentRepository(supabase);
    const sessionRepository = new AttendanceSessionRepository(supabase);
    const recordRepository = new AttendanceRecordRepository(supabase);

    const klass = await classRepository.findById(classId);
    if (!klass || klass.organization_id !== organizationId) {
      return null;
    }

    const enrollments = await classStudentRepository.findByClass(classId);
    const students = await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await studentRepository.findById(enrollment.student_id);
        return {
          studentId: enrollment.student_id,
          fullName: student?.full_name ?? '(siswa terhapus)',
          nis: student?.nis ?? '-',
        };
      }),
    );

    const existingSession = await sessionRepository.findByClassAndDate(classId, date);
    let existingRecordsMap = new Map<string, AttendanceStatus>();

    if (existingSession) {
      const records = await recordRepository.findBySession(existingSession.id);
      existingRecordsMap = new Map(records.map((record) => [record.student_id, record.status]));
    }

    const studentRows: AttendanceStudentRow[] = students.map((student) => ({
      ...student,
      defaultStatus: existingRecordsMap.get(student.studentId) ?? 'hadir',
    }));

    return {
      classId,
      className: klass.name,
      date,
      sessionNotes: existingSession?.notes ?? '',
      students: studentRows,
    };
  }

  async submit(
    organizationId: string,
    classId: string,
    date: string,
    sessionNotes: string,
    createdBy: string,
    records: Array<{ studentId: string; status: AttendanceStatus }>,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const sessionRepository = new AttendanceSessionRepository(supabase);
    const recordRepository = new AttendanceRecordRepository(supabase);

    try {
      let session = await sessionRepository.findByClassAndDate(classId, date);

      if (session) {
        session = await sessionRepository.update(session.id, {
          notes: sessionNotes.trim().length > 0 ? sessionNotes.trim() : null,
        });
      } else {
        session = await sessionRepository.create({
          organization_id: organizationId,
          class_id: classId,
          session_date: date,
          notes: sessionNotes.trim().length > 0 ? sessionNotes.trim() : null,
          created_by: createdBy,
        });
      }

      await recordRepository.upsertMany(
        records.map((record) => ({
          organization_id: organizationId,
          session_id: (session as NonNullable<typeof session>).id,
          student_id: record.studentId,
          status: record.status,
        })),
      );

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan absensi' };
    }
  }

  async listHistory(
    organizationId: string,
    params: { page?: number },
  ): Promise<{ data: AttendanceHistoryRow[]; total: number }> {
    const supabase = createClient();
    const sessionRepository = new AttendanceSessionRepository(supabase);
    const recordRepository = new AttendanceRecordRepository(supabase);
    const classRepository = new ClassRepository(supabase);

    const { data: sessions, total } = await sessionRepository.list({
      organizationId,
      page: params.page,
      pageSize: 10,
    });

    const rows: AttendanceHistoryRow[] = await Promise.all(
      sessions.map(async (session) => {
        const klass = await classRepository.findById(session.class_id);
        const records = await recordRepository.findBySession(session.id);

        return {
          sessionId: session.id,
          classId: session.class_id,
          className: klass?.name ?? '(kelas terhapus)',
          sessionDate: session.session_date,
          hadirCount: records.filter((r) => r.status === 'hadir').length,
          izinCount: records.filter((r) => r.status === 'izin').length,
          sakitCount: records.filter((r) => r.status === 'sakit').length,
          alphaCount: records.filter((r) => r.status === 'alpha').length,
          totalCount: records.length,
        };
      }),
    );

    return { data: rows, total };
  }
}

export const attendanceService = new AttendanceService();