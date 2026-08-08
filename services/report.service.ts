import { createClient } from '@/services/supabase/server';
import { PaymentRepository } from '@/repositories/payment.repository';
import { InvoiceRepository } from '@/repositories/invoice.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { getMonthRange, getMonthLabel } from '@/utils/report';
import { getCategoryLabel, getMethodLabel } from '@/utils/payment';
import { isPastDue } from '@/utils/invoice';
import type {
  FinancialSummary,
  OutstandingInvoiceRow,
  BreakdownItem,
} from '@/features/laporan/laporan.types';
import { PAYMENT_CATEGORY_LIST, PAYMENT_METHOD_LIST } from '@/features/laporan/laporan.types';

export class ReportService {
  async getFinancialSummary(organizationId: string, monthStr: string): Promise<FinancialSummary> {
    const supabase = createClient();
    const paymentRepository = new PaymentRepository(supabase);
    const invoiceRepository = new InvoiceRepository(supabase);

    const { from, to } = getMonthRange(monthStr);
    const payments = await paymentRepository.listPaidInRange(organizationId, from, to);

    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const totalTransactions = payments.length;

    const categoryBreakdown: BreakdownItem[] = PAYMENT_CATEGORY_LIST.map((category) => {
      const rows = payments.filter((payment) => payment.category === category);
      const amount = rows.reduce((sum, row) => sum + Number(row.amount), 0);
      return {
        label: getCategoryLabel(category),
        amount,
        count: rows.length,
        percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
      };
    }).filter((item) => item.count > 0);

    const methodBreakdown: BreakdownItem[] = PAYMENT_METHOD_LIST.map((method) => {
      const rows = payments.filter((payment) => payment.method === method);
      const amount = rows.reduce((sum, row) => sum + Number(row.amount), 0);
      return {
        label: getMethodLabel(method),
        amount,
        count: rows.length,
        percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
      };
    }).filter((item) => item.count > 0);

    const { data: unpaidInvoices } = await invoiceRepository.list({
      organizationId,
      status: 'unpaid',
      pageSize: 1000,
    });

    const totalOutstanding = unpaidInvoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    return {
      monthLabel: getMonthLabel(monthStr),
      totalRevenue,
      totalTransactions,
      categoryBreakdown,
      methodBreakdown,
      totalOutstanding,
      outstandingCount: unpaidInvoices.length,
    };
  }

  async getOutstandingInvoices(organizationId: string): Promise<OutstandingInvoiceRow[]> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const { data: invoices } = await invoiceRepository.list({
      organizationId,
      status: 'unpaid',
      pageSize: 1000,
    });

    const rows: OutstandingInvoiceRow[] = await Promise.all(
      invoices.map(async (invoice) => {
        const student = await studentRepository.findById(invoice.student_id);
        return {
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          studentName: student?.full_name ?? '(siswa terhapus)',
          studentNis: student?.nis ?? '-',
          amount: invoice.amount,
          dueDate: invoice.due_date,
          isOverdue: isPastDue(invoice.due_date, invoice.status),
        };
      }),
    );

    return rows.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }
}

export const reportService = new ReportService();