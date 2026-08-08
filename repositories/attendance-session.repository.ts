import type { TypedSupabaseClient } from '@/types/supabase';
import type { AttendanceSession } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface AttendanceSessionListParams {
  organizationId: string;
  page?: number;
  pageSize?: number;
}

export interface AttendanceSessionListResult {
  data: AttendanceSession[];
  total: number;
}

export class AttendanceSessionRepository extends BaseRepository<AttendanceSession> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'attendance_sessions');
  }

  async list(params: AttendanceSessionListParams): Promise<AttendanceSessionListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from('attendance_sessions')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('session_date', { ascending: false })
      .range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findByClassAndDate(classId: string, date: string): Promise<AttendanceSession | null> {
    const { data, error } = await this.supabase
      .from('attendance_sessions')
      .select('*')
      .eq('class_id', classId)
      .eq('session_date', date)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('findByClassAndDate', error);
    return data;
  }

  async create(
    input: Omit<AttendanceSession, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<AttendanceSession> {
    const { data, error } = await this.supabase
      .from('attendance_sessions')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[attendance_sessions] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<AttendanceSession>): Promise<AttendanceSession> {
    const { data, error } = await this.supabase
      .from('attendance_sessions')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[attendance_sessions] update: no data returned');
    }
    return data;
  }
}