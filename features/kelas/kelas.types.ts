import type { Class } from '@/types/database.types';

export interface ClassActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialClassActionState: ClassActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};

export interface ClassWithTeacher extends Class {
  teacher_name: string | null;
  enrolled_count: number;
}

export interface EnrolledStudentRow {
  enrollmentId: string;
  studentId: string;
  fullName: string;
  nis: string;
}