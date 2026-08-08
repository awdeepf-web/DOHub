export interface StudentActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialStudentActionState: StudentActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};