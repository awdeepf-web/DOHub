import { createClient } from '@/services/supabase/server';
import { InvoiceRepository } from '@/repositories/invoice.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { PaymentRepository } from '@/repositories/payment.repository';
import type { InvoiceInput, GenerateInvoiceInput } from '@/features/invoice/invoice.validation';
import type { InvoiceWithStudent } from '@/features/invoice/invoice.types';
import type { Invoice } from '@/types/database.types';

function toNullable(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

async function generateInvoiceNumber(
  invoiceRepository: InvoiceRepository,
  organizationId: string,
): Promise<string> {
  const count = await invoiceRepository.countByOrganization(organizationId);
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(4, '0');
  return `INV-${year}-${sequence}`;
}

export class InvoiceService {
  async list(
    organizationId: string,
    params: { studentId?: string; status?: Invoice['status']; page?: number },
  ): Promise<{ data: InvoiceWithStudent[]; total: number }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const { data: invoices, total } = await invoiceRepository.list({
      organizationId,
      ...params,
    });

    const merged: InvoiceWithStudent[] = await Promise.all(
      invoices.map(async (invoice) => {
        const student = await studentRepository.findById(invoice.student_id);
        return {
          ...invoice,
          student_name: student?.full_name ?? '(siswa terhapus)',
          student_nis: student?.nis ?? '-',
        };
      }),
    );

    return { data: merged, total };
  }

  async getById(id: string): Promise<Invoice | null> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    return invoiceRepository.findById(id);
  }

  async create(
    organizationId: string,
    createdBy: string,
    input: InvoiceInput,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);

    try {
      const invoiceNumber = await generateInvoiceNumber(invoiceRepository, organizationId);

      await invoiceRepository.create({
        organization_id: organizationId,
        student_id: input.studentId,
        payment_id: null,
        invoice_number: invoiceNumber,
        description: input.description,
        period: toNullable(input.period),
        amount: input.amount,
        due_date: input.dueDate,
        status: 'unpaid',
        paid_at: null,
        notes: toNullable(input.notes),
        created_by: createdBy,
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal membuat invoice' };
    }
  }

  async update(id: string, input: InvoiceInput): Promise<{ error: string | null }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);

    try {
      await invoiceRepository.update(id, {
        student_id: input.studentId,
        description: input.description,
        period: toNullable(input.period),
        amount: input.amount,
        due_date: input.dueDate,
        notes: toNullable(input.notes),
      });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal memperbarui invoice' };
    }
  }

  async remove(id: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    try {
      await invoiceRepository.softDelete(id);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menghapus invoice' };
    }
  }

  /**
   * Tandai invoice sebagai lunas — otomatis bikin baris di tabel payments
   * supaya kedua modul selalu sinkron.
   */
  async markAsPaid(
    id: string,
    organizationId: string,
    createdBy: string,
  ): Promise<{ error: string | null }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    const paymentRepository = new PaymentRepository(supabase);

    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      return { error: 'Invoice tidak ditemukan' };
    }
    if (invoice.status === 'paid') {
      return { error: 'Invoice ini sudah lunas' };
    }

    try {
      const payment = await paymentRepository.create({
        organization_id: organizationId,
        student_id: invoice.student_id,
        category: 'monthly_fee',
        period: invoice.period,
        amount: invoice.amount,
        payment_date: new Date().toISOString().slice(0, 10),
        method: 'cash',
        status: 'paid',
        notes: `Dari invoice ${invoice.invoice_number}`,
        created_by: createdBy,
      });

      await invoiceRepository.update(id, {
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_id: payment.id,
      });

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Gagal menandai invoice lunas' };
    }
  }

  /**
   * Generate invoice massal untuk semua siswa aktif di 1 periode.
   * Siswa yang sudah punya invoice di periode yang sama akan di-skip (tidak dobel).
   */
  async generateBulk(
    organizationId: string,
    createdBy: string,
    input: GenerateInvoiceInput,
  ): Promise<{ error: string | null; createdCount: number; skippedCount: number }> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const { data: students } = await studentRepository.list({
      organizationId,
      status: 'active',
      pageSize: 1000,
    });

    let createdCount = 0;
    let skippedCount = 0;

    try {
      for (const student of students) {
        const alreadyExists = await invoiceRepository.existsForStudentAndPeriod(
          organizationId,
          student.id,
          input.period,
        );

        if (alreadyExists) {
          skippedCount += 1;
          continue;
        }

        const invoiceNumber = await generateInvoiceNumber(invoiceRepository, organizationId);

        await invoiceRepository.create({
          organization_id: organizationId,
          student_id: student.id,
          payment_id: null,
          invoice_number: invoiceNumber,
          description: `SPP ${input.period}`,
          period: input.period,
          amount: input.amount,
          due_date: input.dueDate,
          status: 'unpaid',
          paid_at: null,
          notes: null,
          created_by: createdBy,
        });

        createdCount += 1;
      }

      return { error: null, createdCount, skippedCount };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Gagal generate invoice massal',
        createdCount,
        skippedCount,
      };
    }
  }
}

export const invoiceService = new InvoiceService();