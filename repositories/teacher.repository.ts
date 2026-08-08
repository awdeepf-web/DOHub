import type { TypedSupabaseClient } from '@/types/supabase';
import type { Teacher } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface TeacherListParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
}

export interface TeacherListResult {
  data: Teacher[];
  total: number;
}

export class TeacherRepository extends BaseRepository<Teacher> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'teachers');
  }

  async list(params: TeacherListParams): Promise<TeacherListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from('teachers')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findByProfileId(profileId: string): Promise<Teacher | null> {
    const { data, error } = await this.supabase
      .from('teachers')
      .select('*')
      .eq('profile_id', profileId)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('findByProfileId', error);
    return data;
  }

  async create(
    input: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<Teacher> {
    const { data, error } = await this.supabase
      .from('teachers')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[teachers] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Teacher>): Promise<Teacher> {
    const { data, error } = await this.supabase
      .from('teachers')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[teachers] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('teachers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}