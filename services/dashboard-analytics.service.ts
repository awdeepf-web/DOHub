import { createClient } from '@/services/supabase/server';
import { ClassRepository } from '@/repositories/class.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { AttendanceSessionRepository } from '@/repositories/attendance-session.repository';
import { AttendanceRecordRepository } from '@/repositories/attendance-record.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { InvoiceRepository } from '@/repositories/invoice.repository';

export interface StatusBreakdown {
  label: string;
  count: number;
  percentage: number;
}

export interface WorstAttendanceRow {
  studentName: string;
  studentNis: string;
  alphaCount: number;
}

export interface TopOutstandingInvoiceRow {
  invoiceNumber: string;
  studentName: string;
  amount: number;
  dueDate: string;
}

function daysAgoIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export class DashboardAnalyticsService {
  async getClassStatusBreakdown(organizationId: string): Promise<StatusBreakdown[]> {
    const supabase = createClient();
    const classRepository = new ClassRepository(supabase);
    const { data } = await classRepository.list({ organizationId, pageSize: 1000 });

    const active = data.filter((c) => c.status === 'active').length;
    const inactive = data.filter((c) => c.status === 'inactive').length;
    const total = data.length;

    return [
      { label: 'Aktif', count: active, percentage: total > 0 ? Math.round((active / total) * 100) : 0 },
      { label: 'Tidak Aktif', count: inactive, percentage: total > 0 ? Math.round((inactive / total) * 100) : 0 },
    ].filter((item) => item.count > 0);
  }

  async getTeacherStatusBreakdown(organizationId: string): Promise<StatusBreakdown[]> {
    const supabase = createClient();
    const teacherRepository = new TeacherRepository(supabase);
    const { data } = await teacherRepository.list({ organizationId, pageSize: 1000 });

    const active = data.filter((t) => t.status === 'active').length;
    const inactive = data.filter((t) => t.status === 'inactive').length;
    const total = data.length;

    return [
      { label: 'Aktif', count: active, percentage: total > 0 ? Math.round((active / total) * 100) : 0 },
      { label: 'Tidak Aktif', count: inactive, percentage: total > 0 ? Math.round((inactive / total) * 100) : 0 },
    ].filter((item) => item.count > 0);
  }

  /**
   * Top 5 siswa dengan jumlah Alpha terbanyak dalam 30 hari terakhir.
   */
  async getWorstAttendance(organizationId: string): Promise<WorstAttendanceRow[]> {
    const supabase = createClient();
    const sessionRepository = new AttendanceSessionRepository(supabase);
    const recordRepository = new AttendanceRecordRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const sessions = await recordRepository.listInRange(organizationId, daysAgoIso(30), daysAgoIso(0));
    const recordsNested = await Promise.all(sessions.map((s) => recordRepository.findBySession(s.id)));
    const allRecords = recordsNested.flat();
    const alphaRecords = allRecords.filter((r) => r.status === 'alpha');

    const countByStudent = new Map<string, number>();
    for (const record of alphaRecords) {
      countByStudent.set(record.student_id, (countByStudent.get(record.student_id) ?? 0) + 1);
    }

    const topEntries = [...countByStudent.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const students = await studentRepository.findByIds(topEntries.map(([id]) => id));
    const studentMap = new Map(students.map((s) => [s.id, s]));

    return topEntries.map(([studentId, alphaCount]) => ({
      studentName: studentMap.get(studentId)?.full_name ?? '(siswa terhapus)',
      studentNis: studentMap.get(studentId)?.nis ?? '-',
      alphaCount,
    }));
  }

  /**
   * Top 5 invoice belum lunas dengan nominal terbesar.
   */
  async getTopOutstandingInvoices(organizationId: string): Promise<TopOutstandingInvoiceRow[]> {
    const supabase = createClient();
    const invoiceRepository = new InvoiceRepository(supabase);
    const studentRepository = new StudentRepository(supabase);

    const { data: invoices } = await invoiceRepository.list({
      organizationId,
      status: 'unpaid',
      pageSize: 1000,
    });

    const top = [...invoices].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5);
    const students = await studentRepository.findByIds(top.map((inv) => inv.student_id));
    const studentMap = new Map(students.map((s) => [s.id, s]));

    return top.map((invoice) => ({
      invoiceNumber: invoice.invoice_number,
      studentName: studentMap.get(invoice.student_id)?.full_name ?? '(siswa terhapus)',
      amount: Number(invoice.amount),
      dueDate: invoice.due_date,
    }));
  }
}

export const dashboardAnalyticsService = new DashboardAnalyticsService();