import { createClient } from '@/services/supabase/server';
import { createAdminClient } from '@/services/supabase/admin';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { ProfileRepository } from '@/repositories/profile.repository';
import type { CreateTeacherInput, UpdateTeacherInput } from '@/features/guru/guru.validation';
import type { TeacherWithProfile } from '@/features/guru/guru.types';
import type { TypedSupabaseClient } from '@/types/supabase';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class TeacherService {
  async list(
    organizationId: string,
    params: { page?: number },
  ): Promise<{ data: TeacherWithProfile[]; total: number }> {
    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);

    const { data: teachers, total } = await teacherRepository.list({
      organizationId,
      page: params.page,
    });

    const profileIds = teachers.map((teacher) => teacher.profile_id);
    const profiles = await profileRepository.findByIds(profileIds);
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

    const merged: TeacherWithProfile[] = teachers.map((teacher) => {
      const profile = profileMap.get(teacher.profile_id);
      return {
        ...teacher,
        full_name: profile?.full_name ?? '(profil terhapus)',
        email: profile?.email ?? '-',
        phone: profile?.phone ?? null,
      };
    });

    return { data: merged, total };
  }

  async getById(id: string): Promise<TeacherWithProfile | null> {
    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);

    const teacher = await teacherRepository.findById(id);
    if (!teacher) return null;

    const profile = await profileRepository.findById(teacher.profile_id);
    if (!profile) return null;

    return {
      ...teacher,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
    };
  }

  async create(
    organizationId: string,
    input: CreateTeacherInput,
  ): Promise<{ error: string | null }> {
    const adminClient = createAdminClient();

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        organization_id: organizationId,
        full_name: input.fullName,
        role: 'guru',
      },
    });

    if (authError || !authData.user) {
      if (authError?.message.includes('already been registered')) {
        return { error: 'Email sudah terdaftar' };
      }
      return { error: authError?.message ?? 'Gagal membuat akun guru' };
    }

    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase as unknown as TypedSupabaseClient);

    try {
      // Update nomor HP di profile (trigger hanya isi full_name, email, role)
      if (input.phone) {
        await profileRepository.update(authData.user.id, { phone: toNullable(input.phone) });
      }

      await teacherRepository.create({
        organization_id: organizationId,
        profile_id: authData.user.id,
        subjects: toNullable(input.subjects),
        hourly_rate: input.hourlyRate,
        join_date: toNullable(input.joinDate),
        bio: toNullable(input.bio),
        status: input.status,
      });

      return { error: null };
    } catch (err) {
      // Rollback: hapus akun auth (profile ikut terhapus via FK cascade)
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan data guru' };
    }
  }

  async update(
    teacherId: string,
    profileId: string,
    input: UpdateTeacherInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);

    try {
      await profileRepository.update(profileId, {
        full_name: input.fullName,
        phone: toNullable(input.phone),
      });

      await teacherRepository.update(teacherId, {
        subjects: toNullable(input.subjects),
        hourly_rate: input.hourlyRate,
        join_date: toNullable(input.joinDate),
        bio: toNullable(input.bio),
        status: input.status,
      });

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui data guru' };
    }
  }

  async remove(teacherId: string, profileId: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const profileRepository = new ProfileRepository(supabase);

    try {
      await teacherRepository.softDelete(teacherId);
      // Nonaktifkan juga login guru tsb
      await profileRepository.update(profileId, { is_active: false });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus data guru' };
    }
  }
}

export const teacherService = new TeacherService();