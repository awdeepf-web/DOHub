import { createClient } from '@/services/supabase/server';
import { ProfileRepository } from '@/repositories/profile.repository';
import type { Profile, UserRole } from '@/types/database.types';

export class UserManagementService {
  async listByOrganization(organizationId: string): Promise<Profile[]> {
    const supabase = createClient();
    const profileRepository = new ProfileRepository(supabase);
    return profileRepository.findByOrganization(organizationId);
  }

  async changeRole(
    targetProfileId: string,
    actingProfileId: string,
    newRole: UserRole,
  ): Promise<{ error: string | null }> {
    if (targetProfileId === actingProfileId) {
      return { error: 'Kamu tidak bisa mengubah role akunmu sendiri' };
    }

    const supabase = createClient();
    const profileRepository = new ProfileRepository(supabase);

    try {
      await profileRepository.updateRole(targetProfileId, newRole);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal mengubah role' };
    }
  }

  async toggleActive(
    targetProfileId: string,
    actingProfileId: string,
    isActive: boolean,
  ): Promise<{ error: string | null }> {
    if (targetProfileId === actingProfileId) {
      return { error: 'Kamu tidak bisa menonaktifkan akunmu sendiri' };
    }

    const supabase = createClient();
    const profileRepository = new ProfileRepository(supabase);

    try {
      await profileRepository.update(targetProfileId, { is_active: isActive });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal mengubah status akun' };
    }
  }
}

export const userManagementService = new UserManagementService();