export interface SectionActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialSectionActionState: SectionActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};