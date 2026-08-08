import type { Invoice } from '@/types/database.types';

export interface InvoiceActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialInvoiceActionState: InvoiceActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};

export interface GenerateInvoiceActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
  createdCount: number;
  skippedCount: number;
}

export const initialGenerateInvoiceActionState: GenerateInvoiceActionState = {
  error: null,
  fieldErrors: null,
  success: false,
  createdCount: 0,
  skippedCount: 0,
};

export interface InvoiceWithStudent extends Invoice {
  student_name: string;
  student_nis: string;
}