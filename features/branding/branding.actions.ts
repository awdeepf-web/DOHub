'use server';

import { revalidatePath } from 'next/cache';
import { requireProfile, assertPermission } from '@/utils/guard';
import { brandingService } from '@/services/branding.service';
import { brandingSchema } from '@/features/branding/branding.validation';
import {
  initialBrandingActionState,
  initialLogoUploadState,
  type BrandingActionState,
  type LogoUploadState,
} from '@/features/branding/branding.types';

export async function updateBrandingAction(
  _prevState: BrandingActionState,
  formData: FormData,
): Promise<BrandingActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'branding:manage');
  } catch (err) {
    return { ...initialBrandingActionState, error: (err as Error).message };
  }

  const parsed = brandingSchema.safeParse({
    name: formData.get('name'),
    domain: formData.get('domain'),
    themePrimaryColor: formData.get('themePrimaryColor'),
    themeSecondaryColor: formData.get('themeSecondaryColor'),
    socialInstagram: formData.get('socialInstagram'),
    socialFacebook: formData.get('socialFacebook'),
    socialYoutube: formData.get('socialYoutube'),
    socialWhatsapp: formData.get('socialWhatsapp'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    customDomain: formData.get('customDomain'),
    metaPixelId: formData.get('metaPixelId'),
    googleAnalyticsId: formData.get('googleAnalyticsId'),
  });

  if (!parsed.success) {
    return { ...initialBrandingActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await brandingService.update(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialBrandingActionState, error };
  }

  revalidatePath('/dashboard/branding');
  revalidatePath('/dashboard');
  return { ...initialBrandingActionState, success: true };
}

export async function uploadLogoAction(
  _prevState: LogoUploadState,
  formData: FormData,
): Promise<LogoUploadState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'branding:manage');
  } catch (err) {
    return { ...initialLogoUploadState, error: (err as Error).message };
  }

  const file = formData.get('logo');
  if (!(file instanceof File) || file.size === 0) {
    return { ...initialLogoUploadState, error: 'Pilih file logo terlebih dahulu' };
  }

  const { error, logoUrl } = await brandingService.uploadLogo(profile.organization_id, file);
  if (error) {
    return { ...initialLogoUploadState, error };
  }

  revalidatePath('/dashboard/branding');
  revalidatePath('/dashboard');
  return { error: null, success: true, logoUrl };
}

export async function uploadFaviconAction(
  _prevState: LogoUploadState,
  formData: FormData,
): Promise<LogoUploadState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'branding:manage');
  } catch (err) {
    return { ...initialLogoUploadState, error: (err as Error).message };
  }

  const file = formData.get('favicon');
  if (!(file instanceof File) || file.size === 0) {
    return { ...initialLogoUploadState, error: 'Pilih file favicon terlebih dahulu' };
  }

  const { error, faviconUrl } = await brandingService.uploadFavicon(profile.organization_id, file);
  if (error) {
    return { ...initialLogoUploadState, error };
  }

  revalidatePath('/dashboard/branding');
  return { error: null, success: true, logoUrl: faviconUrl };
}