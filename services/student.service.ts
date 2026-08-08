import { createClient } from '@/services/supabase/server';
import { StudentRepository } from '@/repositories/student.repository';
import type { StudentInput } from '@/features/siswa/siswa.validation';
import type { Student } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class StudentService {
  async list(
    organizationId: string,
    params: { search?: string; status?: Student['status']; page?: number },
  ) {
    const supabase = createClient();
    const repository = new StudentRepository(supabase);
    return repository.list({ organizationId, ...params });
  }

  async getById(id: string): Promise<Student | null> {
    const supabase = createClient();
    const repository = new StudentRepository(supabase);
    return repository.findById(id);
  }

  async create(
    organizationId: string,
    input: StudentInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new StudentRepository(supabase);

    const existing = await repository.findByNis(organizationId, input.nis);
    if (existing) {
      return { error: 'NIS sudah digunakan siswa lain' };
    }

    try {
      await repository.create({
        organization_id: organizationId,
        nis: input.nis,
        full_name: input.fullName,
        gender: input.gender,
        birth_place: toNullable(input.birthPlace),
        birth_date: toNullable(input.birthDate),
        address: toNullable(input.address),
        phone: toNullable(input.phone),
        parent_name: toNullable(input.parentName),
        parent_phone: toNullable(input.parentPhone),
        school_origin: toNullable(input.schoolOrigin),
        photo_url: null,
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan data siswa' };
    }
  }

  async update(
    id: string,
    organizationId: string,
    input: StudentInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new StudentRepository(supabase);

    const existing = await repository.findByNis(organizationId, input.nis);
    if (existing && existing.id !== id) {
      return { error: 'NIS sudah digunakan siswa lain' };
    }

    try {
      await repository.update(id, {
        nis: input.nis,
        full_name: input.fullName,
        gender: input.gender,
        birth_place: toNullable(input.birthPlace),
        birth_date: toNullable(input.birthDate),
        address: toNullable(input.address),
        phone: toNullable(input.phone),
        parent_name: toNullable(input.parentName),
        parent_phone: toNullable(input.parentPhone),
        school_origin: toNullable(input.schoolOrigin),
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui data siswa' };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const repository = new StudentRepository(supabase);
    try {
      await repository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus data siswa' };
    }
  }
}

export const studentService = new StudentService();