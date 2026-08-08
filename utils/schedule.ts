import type { DayOfWeek } from '@/types/database.types';

export const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
  { value: 'sunday', label: 'Minggu' },
];

const DAY_LABEL_MAP: Record<DayOfWeek, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

const DAY_ORDER: Record<DayOfWeek, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

export function getDayLabel(day: DayOfWeek): string {
  return DAY_LABEL_MAP[day];
}

export function getDayOrder(day: DayOfWeek): number {
  return DAY_ORDER[day];
}

/**
 * Format "08:00:00" (dari database) jadi "08:00" (tampilan).
 */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}