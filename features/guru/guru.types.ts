import type { Teacher } from '@/types/database.types';

export interface TeacherActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialTeacherActionState: TeacherActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};

export interface TeacherWithProfile extends Teacher {
  full_name: string;
  email: string;
  phone: string | null;
}