import { createClient } from '@/services/supabase/server';
import { createAdminClient } from '@/services/supabase/admin';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import type { LoginInput, RegisterInput } from '@/features/auth/auth.validation';
import type { Profile } from '@/types/database.types';
import type { TypedSupabaseClient } from '@/types/supabase';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export class AuthService {
  async login(input: LoginInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email atau password salah' };
      }
      return { error: error.message };
    }

    // Cek is_active SETELAH login berhasil — kalau nonaktif, langsung sign-out lagi
    // dan tolak, supaya tidak ada sesi "setengah aktif" yang tersimpan di browser.
    const profile = await this.getCurrentProfile();
    if (!profile) {
      await supabase.auth.signOut();
      return { error: 'Akun ini sudah dinonaktifkan. Hubungi Owner/Admin bimbel kamu.' };
    }

    return { error: null };
  }

  async register(
    input: RegisterInput,
  ): Promise<{ error: string | null; needsEmailConfirmation: boolean }> {
    const adminClient = createAdminClient();
    const orgRepository = new OrganizationRepository(
      adminClient as unknown as TypedSupabaseClient,
    );

    const baseSlug = slugify(input.organizationName);
    let slug = baseSlug;
    let attempt = 0;

    while (await orgRepository.findBySlug(slug)) {
      attempt += 1;
      slug = `${baseSlug}-${attempt}`;
      if (attempt > 20) {
        return { error: 'Gagal membuat slug organisasi, coba nama lain', needsEmailConfirmation: false };
      }
    }

    let organizationId: string;
    try {
      const organization = await orgRepository.create({
        name: input.organizationName,
        slug,
        email: input.email,
      });
      organizationId = organization.id;
    } catch {
      return { error: 'Gagal membuat organisasi baru', needsEmailConfirmation: false };
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          organization_id: organizationId,
          full_name: input.fullName,
          role: 'owner',
        },
      },
    });

    if (error) {
      await adminClient.from('organizations').delete().eq('id', organizationId);

      if (error.message.includes('already registered')) {
        return { error: 'Email sudah terdaftar', needsEmailConfirmation: false };
      }
      return { error: error.message, needsEmailConfirmation: false };
    }

    const needsEmailConfirmation = !data.session;
    return { error: null, needsEmailConfirmation };
  }

  async logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  /**
   * Mengembalikan profile HANYA jika akun tsb masih aktif (is_active = true).
   * Ini titik pusat keamanan: middleware & semua requireProfile() bergantung
   * pada fungsi ini, jadi begitu Owner menonaktifkan seorang user dari menu
   * User Management, user itu otomatis "dianggap logout" di request berikutnya,
   * meski token sesi auth-nya sendiri masih teknis valid.
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const profileRepository = new ProfileRepository(supabase);
    const profile = await profileRepository.findById(user.id);

    if (!profile || !profile.is_active) return null;

    return profile;
  }
}

export const authService = new AuthService();