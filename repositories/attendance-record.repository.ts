import type { TypedSupabaseClient } from '@/types/supabase';
import type { AttendanceRecord, AttendanceSession } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class AttendanceRecordRepository extends BaseRepository<AttendanceRecord> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'attendance_records');
  }

  async findBySession(sessionId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await this.supabase
      .from('attendance_records')
      .select('*')
      .eq('session_id', sessionId)
      .is('deleted_at', null);

    this.handleError('findBySession', error);
    return data ?? [];
  }

  async upsertMany(
    rows: Array<{
      organization_id: string;
      session_id: string;
      student_id: string;
      status: AttendanceRecord['status'];
    }>,
  ): Promise<AttendanceRecord[]> {
    const { data, error } = await this.supabase
      .from('attendance_records')
      .upsert(rows, { onConflict: 'session_id,student_id' })
      .select('*');

    this.handleError('upsertMany', error);
    return data ?? [];
  }

  async listInRange(organizationId: string, fromDate: string, toDate: string): Promise<AttendanceSession[]> {
    const { data, error } = await this.supabase
      .from('attendance_sessions')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('session_date', fromDate)
      .lte('session_date', toDate)
      .is('deleted_at', null);

    this.handleError('listInRange', error);
    return data ?? [];
  }
}