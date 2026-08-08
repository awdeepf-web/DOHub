import { createClient } from '@/services/supabase/server';
import { PaymentRepository } from '@/repositories/payment.repository';
import { StudentRepository } from '@/repositories/student.repository';
import type { PaymentInput } from '@/features/pembayaran/pembayaran.validation';
import type { PaymentWithStudent } from '@/features/pembayaran/pembayaran.types';
import type { Payment } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export class PaymentService {
  async list(
    organizationId: string,
    params: { studentId?: string; category?: Payment['category']; status?: Payment['status']; page?: number },
  ): Promise<{ data: PaymentWithStudent[]; total: number }> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const { data: payments, total } = await paymentRepository.list({
      organizationId,
      ...params,
    });

    const merged: PaymentWithStudent[] = await Promise.all(
      payments.map(async (payment) => {
        const student = await studentRepository.findById(payment.student_id);
        return {
          ...payment,
          student_name: student?.full_name ?? '(siswa terhapus)',
          student_nis: student?.nis ?? '-',
        };
      }),
    );

    return { data: merged, total };
  }

  async getById(id: string): Promise<Payment | null> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);
    return paymentRepository.findById(id);
  }

  async create(
    organizationId: string,
    createdBy: string,
    input: PaymentInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);

    try {
      await paymentRepository.create({
        organization_id: organizationId,
        student_id: input.studentId,
        category: input.category,
        period: toNullable(input.period),
        amount: input.amount,
        payment_date: input.paymentDate,
        method: input.method,
        status: input.status,
        notes: toNullable(input.notes),
        created_by: createdBy,
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menyimpan pembayaran' };
    }
  }

  async update(id: string, input: PaymentInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);

    try {
      await paymentRepository.update(id, {
        student_id: input.studentId,
        category: input.category,
        period: toNullable(input.period),
        amount: input.amount,
        payment_date: input.paymentDate,
        method: input.method,
        status: input.status,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui pembayaran' };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);
    try {
      await paymentRepository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus pembayaran' };
    }
  }
}

export const paymentService = new PaymentService();