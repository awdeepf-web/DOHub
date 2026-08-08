import type { ClassSchedule } from '@/types/database.types';

export interface ScheduleActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
  warning: string | null;
}

export const initialScheduleActionState: ScheduleActionState = {
  error: null,
  fieldErrors: null,
  success: false,
  warning: null,
};

export interface ScheduleWithClass extends ClassSchedule {
  class_name: string;
  teacher_name: string | null;
}