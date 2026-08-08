import type { TypedSupabaseClient } from '@/types/supabase';
import type { Payment } from '@/types/database.types';
import { BaseRepository } from '@/repositories/base.repository';

export interface PaymentListParams {
  organizationId: string;
  studentId?: string;
  category?: Payment['category'];
  status?: Payment['status'];
  page?: number;
  pageSize?: number;
}

export interface PaymentListResult {
  data: Payment[];
  total: number;
}

export class PaymentRepository extends BaseRepository<Payment> {
  constructor(supabase: TypedSupabaseClient) {
    super(supabase, 'payments');
  }

  async list(params: PaymentListParams): Promise<PaymentListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('organization_id', params.organizationId)
      .is('deleted_at', null)
      .order('payment_date', { ascending: false });

    if (params.studentId) {
      query = query.eq('student_id', params.studentId);
    }
    if (params.category) {
      query = query.eq('category', params.category);
    }
    if (params.status) {
      query = query.eq('status', params.status);
    }

    const { data, error, count } = await query.range(from, to);

    this.handleError('list', error);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findByStudent(studentId: string): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .is('deleted_at', null)
      .order('payment_date', { ascending: false });

    this.handleError('findByStudent', error);
    return data ?? [];
  }

  /**
   * Ambil semua pembayaran LUNAS dalam rentang tanggal tertentu.
   * Dipakai untuk Modul Laporan — mengambil select('*') (bukan select('amount')
   * atau kolom parsial lain) supaya tipe tetap konsisten & aman, sesuai pola
   * yang sudah terbukti jalan di seluruh Repository lainnya.
   */
  async listPaidInRange(organizationId: string, fromDate: string, toDate: string): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'paid')
      .gte('payment_date', fromDate)
      .lte('payment_date', toDate)
      .is('deleted_at', null);

    this.handleError('listPaidInRange', error);
    return data ?? [];
  }

  async create(
    input: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ): Promise<Payment> {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(input)
      .select('*')
      .single();

    this.handleError('create', error);
    if (!data) {
      throw new Error('[payments] create: no data returned');
    }
    return data;
  }

  async update(id: string, input: Partial<Payment>): Promise<Payment> {
    const { data, error } = await this.supabase
      .from('payments')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError('update', error);
    if (!data) {
      throw new Error('[payments] update: no data returned');
    }
    return data;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('payments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    this.handleError('softDelete', error);
  }
}