'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { attendanceService } from '@/services/attendance.service';
import { ATTENDANCE_STATUS_VALUES } from '@/features/absensi/absensi.validation';
import { initialAttendanceActionState, type AttendanceActionState } from '@/features/absensi/absensi.types';
import type { AttendanceStatus } from '@/types/database.types';

function isValidStatus(value: FormDataEntryValue | null): value is AttendanceStatus {
  return typeof value === 'string' && (ATTENDANCE_STATUS_VALUES as readonly string[]).includes(value);
}

export async function submitAttendanceAction(
  classId: string,
  date: string,
  _prevState: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'attendance:manage');
  } catch (err) {
    return { ...initialAttendanceActionState, error: (err as Error).message };
  }

  const studentIdsRaw = formData.get('studentIds');
  if (typeof studentIdsRaw !== 'string' || studentIdsRaw.trim().length === 0) {
    return { ...initialAttendanceActionState, error: 'Tidak ada siswa untuk diabsen' };
  }

  const studentIds = studentIdsRaw.split(',').filter(Boolean);
  const records: Array<{ studentId: string; status: AttendanceStatus }> = [];

  for (const studentId of studentIds) {
    const statusValue = formData.get(`status_${studentId}`);
    if (!isValidStatus(statusValue)) {
      return { ...initialAttendanceActionState, error: 'Status absensi tidak valid, coba lagi' };
    }
    records.push({ studentId, status: statusValue });
  }

  const sessionNotes = String(formData.get('sessionNotes') ?? '');

  const { error } = await attendanceService.submit(
    profile.organization_id,
    classId,
    date,
    sessionNotes,
    profile.id,
    records,
  );

  if (error) {
    return { ...initialAttendanceActionState, error };
  }

  revalidatePath('/dashboard/absensi');
  redirect('/dashboard/absensi');
}