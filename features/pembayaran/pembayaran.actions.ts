'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { paymentService } from '@/services/payment.service';
import { paymentSchema } from '@/features/pembayaran/pembayaran.validation';
import {
  initialPaymentActionState,
  type PaymentActionState,
} from '@/features/pembayaran/pembayaran.types';

function parseForm(formData: FormData) {
  return {
    studentId: formData.get('studentId'),
    category: formData.get('category'),
    period: formData.get('period'),
    amount: formData.get('amount'),
    paymentDate: formData.get('paymentDate'),
    method: formData.get('method'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  };
}

export async function createPaymentAction(
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'payment:manage');
  } catch (err) {
    return { ...initialPaymentActionState, error: (err as Error).message };
  }

  const parsed = paymentSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialPaymentActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await paymentService.create(profile.organization_id, profile.id, parsed.data);
  if (error) {
    return { ...initialPaymentActionState, error };
  }

  revalidatePath('/dashboard/pembayaran');
  redirect('/dashboard/pembayaran');
}

export async function updatePaymentAction(
  id: string,
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'payment:manage');
  } catch (err) {
    return { ...initialPaymentActionState, error: (err as Error).message };
  }

  const parsed = paymentSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialPaymentActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await paymentService.update(id, parsed.data);
  if (error) {
    return { ...initialPaymentActionState, error };
  }

  revalidatePath('/dashboard/pembayaran');
  redirect('/dashboard/pembayaran');
}

export async function deletePaymentAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'payment:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await paymentService.remove(id);
  revalidatePath('/dashboard/pembayaran');
  return result;
}