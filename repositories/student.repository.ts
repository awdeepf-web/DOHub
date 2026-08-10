import type { TypedSupabaseClient } from '@/types/supabase';
import type { Student } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface StudentListParams {
  organizationId: string;
  search?: string;
  status?: Student['status'];
  page?: number;
  pageSize?: number;
}

export interface StudentListResult {
  data: Student[];
  total: number;
}

export class StudentRepository extends BaseRepository<Student> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'students');
  }

  async list(params: StudentListParams): Promise<StudentListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from('students')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('full_name', { ascending: true });

    if (params.search) {
      const term = params.search.replace(/[%,]/g, '');
      query = query.or(`full_name.ilike.%${term}%,nis.ilike.%${term}%`);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    const { data, error, count } = await query.range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findByNis(organizationId: string, nis: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('nis', nis)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('findByNis', error);
    return data;
  }

  async findByIds(ids: string[]): Promise<Student[]> {
    if (ids.length === 0) return [];
    const { data, error } = await this.supabase
      .from('students')
      .select('*')
      .in('id', ids)
      .is('deleted_at', null);

    this.handleError('findByIds', error);
    return data ?? [];
  }

  async create(
    input: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<Student> {
    const { data, error } = await this.supabase
      .from('students')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[students] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Student>): Promise<Student> {
    const { data, error } = await this.supabase
      .from('students')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[students] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('students')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}