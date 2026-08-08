import type { PaymentCategory, PaymentMethod } from '@/types/database.types';

export interface BreakdownItem {
  label: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface FinancialSummary {
  monthLabel: string;
  totalRevenue: number;
  totalTransactions: number;
  categoryBreakdown: BreakdownItem[];
  methodBreakdown: BreakdownItem[];
  totalOutstanding: number;
  outstandingCount: number;
}

export interface OutstandingInvoiceRow {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentNis: string;
  amount: number;
  dueDate: string;
  isOverdue: boolean;
}

export const PAYMENT_CATEGORY_LIST: PaymentCategory[] = ['registration', 'monthly_fee', 'other'];
export const PAYMENT_METHOD_LIST: PaymentMethod[] = ['cash', 'transfer', 'other'];