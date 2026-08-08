'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { invoiceService } from '@/services/invoice.service';
import { invoiceSchema, generateInvoiceSchema } from '@/features/invoice/invoice.validation';
import {
  initialInvoiceActionState,
  initialGenerateInvoiceActionState,
  type InvoiceActionState,
  type GenerateInvoiceActionState,
} from '@/features/invoice/invoice.types';

function parseForm(formData: FormData) {
  return {
    studentId: formData.get('studentId'),
    description: formData.get('description'),
    period: formData.get('period'),
    amount: formData.get('amount'),
    dueDate: formData.get('dueDate'),
    notes: formData.get('notes'),
  };
}

export async function createInvoiceAction(
  _prevState: InvoiceActionState,
  formData: FormData,
): Promise<InvoiceActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'invoice:manage');
  } catch (err) {
    return { ...initialInvoiceActionState, error: (err as Error).message };
  }

  const parsed = invoiceSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialInvoiceActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await invoiceService.create(profile.organization_id, profile.id, parsed.data);
  if (error) {
    return { ...initialInvoiceActionState, error };
  }

  revalidatePath('/dashboard/invoice');
  redirect('/dashboard/invoice');
}

export async function updateInvoiceAction(
  id: string,
  _prevState: InvoiceActionState,
  formData: FormData,
): Promise<InvoiceActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'invoice:manage');
  } catch (err) {
    return { ...initialInvoiceActionState, error: (err as Error).message };
  }

  const parsed = invoiceSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialInvoiceActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await invoiceService.update(id, parsed.data);
  if (error) {
    return { ...initialInvoiceActionState, error };
  }

  revalidatePath('/dashboard/invoice');
  redirect('/dashboard/invoice');
}

export async function deleteInvoiceAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'invoice:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await invoiceService.remove(id);
  revalidatePath('/dashboard/invoice');
  return result;
}

export async function markInvoicePaidAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'invoice:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await invoiceService.markAsPaid(id, profile.organization_id, profile.id);
  revalidatePath('/dashboard/invoice');
  return result;
}

export async function generateBulkInvoiceAction(
  _prevState: GenerateInvoiceActionState,
  formData: FormData,
): Promise<GenerateInvoiceActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'invoice:manage');
  } catch (err) {
    return { ...initialGenerateInvoiceActionState, error: (err as Error).message };
  }

  const parsed = generateInvoiceSchema.safeParse({
    period: formData.get('period'),
    amount: formData.get('amount'),
    dueDate: formData.get('dueDate'),
  });

  if (!parsed.success) {
    return { ...initialGenerateInvoiceActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error, createdCount, skippedCount } = await invoiceService.generateBulk(
    profile.organization_id,
    profile.id,
    parsed.data,
  );

  if (error) {
    return { ...initialGenerateInvoiceActionState, error, createdCount, skippedCount };
  }

  revalidatePath('/dashboard/invoice');
  return { ...initialGenerateInvoiceActionState, success: true, createdCount, skippedCount };
}