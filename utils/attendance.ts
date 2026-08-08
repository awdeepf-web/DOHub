import type { AttendanceStatus } from '@/types/database.types';

export const ATTENDANCE_STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'izin', label: 'Izin' },
  { value: 'sakit', label: 'Sakit' },
  { value: 'alpha', label: 'Alpha' },
];

const STATUS_LABEL_MAP: Record<AttendanceStatus, string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  alpha: 'Alpha',
};

export function getAttendanceStatusLabel(status: AttendanceStatus): string {
  return STATUS_LABEL_MAP[status];
}

export function getAttendanceBadgeVariant(
  status: AttendanceStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'hadir':
      return 'default';
    case 'izin':
    case 'sakit':
      return 'secondary';
    case 'alpha':
      return 'destructive';
    default:
      return 'outline';
  }
}