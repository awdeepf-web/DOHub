import type { TypedSupabaseClient } from '@/types/supabase';
import type { ClassStudent } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export class ClassStudentRepository extends BaseRepository<ClassStudent> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'class_students');
  }

  async findByClass(classId: string): Promise<ClassStudent[]> {
    const { data, error } = await this.supabase
      .from('class_students')
      .select('*')
      .eq('class_id', classId)
      .is('deleted_at', null)
      .order('enrolled_at', { ascending: true });

    this.handleError('findByClass', error);
    return data ?? [];
  }

  async isEnrolled(classId: string, studentId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('class_students')
      .select('id')
      .eq('class_id', classId)
      .eq('student_id', studentId)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('isEnrolled', error);
    return Boolean(data);
  }

  async enroll(input: {
    organization_id: string;
    class_id: string;
    student_id: string;
  }): Promise<ClassStudent> {
    const { data, error } = await this.supabase
      .from('class_students')
      .insert(input)
      .select('*')
      .single();

    this.handleError('enroll', error);
    if (!data) {
      throw new Error('[class_students] enroll: no data returned');
    }
    return data;
  }

  async unenroll(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('class_students')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('unenroll', error);
  }

  async countByClass(classId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('class_students')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', classId)
      .is('deleted_at', null);

    this.handleError('countByClass', error);
    return count ?? 0;
  }
}