import type { TypedSupabaseClient } from '@/types/supabase';
import type { ClassSchedule } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class ClassScheduleRepository extends BaseRepository<ClassSchedule> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'class_schedules');
  }

  async listByOrganization(organizationId: string): Promise<ClassSchedule[]> {
    const { data, error } = await this.supabase
      .from('class_schedules')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    this.handleError('listByOrganization', error);
    return data ?? [];
  }

  async listByClass(classId: string): Promise<ClassSchedule[]> {
    const { data, error } = await this.supabase
      .from('class_schedules')
      .select('*')
      .eq('class_id', classId)
      .is('deleted_at', null)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    this.handleError('listByClass', error);
    return data ?? [];
  }

  async findConflicting(params: {
    organizationId: string;
    teacherClassIds: string[];
    dayOfWeek: ClassSchedule['day_of_week'];
    startTime: string;
    endTime: string;
    excludeId?: string;
  }): Promise<ClassSchedule[]> {
    if (params.teacherClassIds.length === 0) return [];

    let query = this.supabase
      .from('class_schedules')
      .select('*')
      .eq('organization_id', params.organizationId)
      .eq('day_of_week', params.dayOfWeek)
      .in('class_id', params.teacherClassIds)
      .is('deleted_at', null)
      .lt('start_time', params.endTime)
      .gt('end_time', params.startTime);

    if (params.excludeId) {
      query = query.neq('id', params.excludeId);
    }

    const { data, error } = await query;
    this.handleError('findConflicting', error);
    return data ?? [];
  }

  async create(
    input: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<ClassSchedule> {
    const { data, error } = await this.supabase
      .from('class_schedules')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[class_schedules] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<ClassSchedule>): Promise<ClassSchedule> {
    const { data, error } = await this.supabase
      .from('class_schedules')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[class_schedules] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('class_schedules')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}