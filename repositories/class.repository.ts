import type { TypedSupabaseClient } from '@/types/supabase';
import type { Class } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface ClassListParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
}

export interface ClassListResult {
  data: Class[];
  total: number;
}

export class ClassRepository extends BaseRepository<Class> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'classes');
  }

  async list(params: ClassListParams): Promise<ClassListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from('classes')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findByTeacher(organizationId: string, teacherId: string): Promise<Class[]> {
    const { data, error } = await this.supabase
      .from('classes')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('teacher_id', teacherId)
      .is('deleted_at', null);

    this.handleError('findByTeacher', error);
    return data ?? [];
  }

  async create(
    input: Omit<Class, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<Class> {
    const { data, error } = await this.supabase
      .from('classes')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[classes] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Class>): Promise<Class> {
    const { data, error } = await this.supabase
      .from('classes')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[classes] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('classes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}