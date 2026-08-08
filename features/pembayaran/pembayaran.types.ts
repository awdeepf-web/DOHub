import type { Payment } from '@/types/database.types';

export interface PaymentActionState {
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  success: boolean;
}

export const initialPaymentActionState: PaymentActionState = {
  error: null,
  fieldErrors: null,
  success: false,
};

export interface PaymentWithStudent extends Payment {
  student_name: string;
  student_nis: string;
}