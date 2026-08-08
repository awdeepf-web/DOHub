export interface SettingsActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialSettingsActionState: SettingsActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};