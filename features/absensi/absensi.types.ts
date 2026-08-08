import type { AttendanceStatus } from '@/types/database.types';

export interface AttendanceActionState {
  error: string | null;
  success: boolean;
}

export const initialAttendanceActionState: AttendanceActionState = {
  error: null,
  success: false,
};

export interface AttendanceStudentRow {
  studentId: string;
  fullName: string;
  nis: string;
  defaultStatus: AttendanceStatus;
}

export interface AttendanceHistoryRow {
  sessionId: string;
  classId: string;
  className: string;
  sessionDate: string;
  hadirCount: number;
  izinCount: number;
  sakitCount: number;
  alphaCount: number;
  totalCount: number;
}

export interface AttendanceTodayOverview {
  attendancePercentage: number;
  trendPoints: number;
  totalHadir: number;
  totalIzinSakit: number;
  activeClassesToday: number;
}