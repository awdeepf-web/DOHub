'use server';

import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/utils/guard';
import { settingsService } from '@/services/settings.service';
import {
  profileSettingsSchema,
  changePasswordSchema,
  organizationSettingsSchema,
} from '@/features/settings/settings.validation';
import {
  initialSettingsActionState,
  type SettingsActionState,
} from '@/features/settings/settings.types';

export async function updateProfileSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const profile = await requireProfile();

  const parsed = profileSettingsSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
  });

  if (!parsed.success) {
    return { ...initialSettingsActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await settingsService.updateProfile(profile.id, parsed.data);
  if (error) {
    return { ...initialSettingsActionState, error };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { ...initialSettingsActionState, success: true };
}

export async function changePasswordAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireProfile();

  const parsed = changePasswordSchema.safeParse({
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { ...initialSettingsActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await settingsService.changePassword(parsed.data);
  if (error) {
    return { ...initialSettingsActionState, error };
  }

  return { ...initialSettingsActionState, success: true };
}

export async function updateOrganizationSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const profile = await requireProfile();

  if (profile.role !== 'owner') {
    return { ...initialSettingsActionState, error: 'Hanya Owner yang boleh mengubah pengaturan ini' };
  }

  const parsed = organizationSettingsSchema.safeParse({
    slug: formData.get('slug'),
    isActive: formData.get('isActive'),
  });

  if (!parsed.success) {
    return { ...initialSettingsActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await settingsService.updateOrganizationSettings(
    profile.organization_id,
    parsed.data,
  );
  if (error) {
    return { ...initialSettingsActionState, error };
  }

  revalidatePath('/dashboard/settings');
  return { ...initialSettingsActionState, success: true };
}