import type { TypedSupabaseClient } from '@/types/supabase';
import type { Invoice } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface InvoiceListParams {
  organizationId: string;
  studentId?: string;
  status?: Invoice['status'];
  page?: number;
  pageSize?: number;
}

export interface InvoiceListResult {
  data: Invoice[];
  total: number;
}

export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'invoices');
  }

  async list(params: InvoiceListParams): Promise<InvoiceListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('due_date', { ascending: false });

    if (params.studentId) {
      query = query.eq('student_id', params.studentId);
    }
    if (params.status) {
      query = query.eq('status', params.status);
    }

    const { data, error, count } = await query.range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async countByOrganization(organizationId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    this.handleError('countByOrganization', error);
    return count ?? 0;
  }

  async existsForStudentAndPeriod(
    organizationId: string,
    studentId: string,
    period: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('student_id', studentId)
      .eq('period', period)
      .is('deleted_at', null)
      .maybeSingle();

    this.handleError('existsForStudentAndPeriod', error);
    return Boolean(data);
  }

  async create(
    input: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<Invoice> {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[invoices] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await this.supabase
      .from('invoices')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[invoices] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}