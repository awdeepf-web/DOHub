export interface AuthActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
  message: string | null;
}

export const initialAuthActionState: AuthActionState = {
  error: null,
  fieldErrors: null,
  success: false,
  message: null,
};