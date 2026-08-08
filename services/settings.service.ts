import { createClient } from '@/services/supabase/server';
import { ProfileRepository } from '@/repositories/profile.repository';
import { OrganizationRepository } from '@/repositories/organization.repository';
import type {
  ProfileSettingsInput,
  ChangePasswordInput,
  OrganizationSettingsInput,
} from '@/features/settings/settings.validation';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class SettingsService {
  async updateProfile(
    profileId: string,
    input: ProfileSettingsInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const profileRepository = new ProfileRepository(supabase);

    try {
      await profileRepository.update(profileId, {
        full_name: input.fullName,
        phone: toNullable(input.phone),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui profil' };
    }
  }

  async changePassword(input: ChangePasswordInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: input.newPassword });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }

  async updateOrganizationSettings(
    organizationId: string,
    input: OrganizationSettingsInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const orgRepository = new OrganizationRepository(supabase);

    const existing = await orgRepository.findBySlug(input.slug);
    if (existing && existing.id !== organizationId) {
      return { error: 'Slug sudah digunakan bimbel lain, coba yang lain' };
    }

    try {
      await orgRepository.update(organizationId, {
        slug: input.slug,
        is_active: input.isActive === 'true',
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui pengaturan organisasi' };
    }
  }
}

export const settingsService = new SettingsService();