export interface BrandingActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialBrandingActionState: BrandingActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};

export interface LogoUploadState {
  error: string | null;
  success: boolean;
  logoUrl: string | null;
}

export const initialLogoUploadState: LogoUploadState = {
  error: null,
  success: false,
  logoUrl: null,
};