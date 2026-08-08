'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { classService } from '@/services/class.service';
import { classSchema, enrollStudentSchema } from '@/features/kelas/kelas.validation';
import {
  initialClassActionState,
  type ClassActionState,
} from '@/features/kelas/kelas.types';

function parseClassForm(formData: FormData) {
  return {
    name: formData.get('name'),
    teacherId: formData.get('teacherId'),
    subject: formData.get('subject'),
    capacity: formData.get('capacity'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  };
}

export async function createClassAction(
  _prevState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'class:manage');
  } catch (err) {
    return { ...initialClassActionState, error: (err as Error).message };
  }

  const parsed = classSchema.safeParse(parseClassForm(formData));
  if (!parsed.success) {
    return { ...initialClassActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await classService.create(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialClassActionState, error };
  }

  revalidatePath('/dashboard/kelas');
  redirect('/dashboard/kelas');
}

export async function updateClassAction(
  id: string,
  _prevState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'class:manage');
  } catch (err) {
    return { ...initialClassActionState, error: (err as Error).message };
  }

  const parsed = classSchema.safeParse(parseClassForm(formData));
  if (!parsed.success) {
    return { ...initialClassActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await classService.update(id, parsed.data);
  if (error) {
    return { ...initialClassActionState, error };
  }

  revalidatePath('/dashboard/kelas');
  redirect('/dashboard/kelas');
}

export async function deleteClassAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'class:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await classService.remove(id);
  revalidatePath('/dashboard/kelas');
  return result;
}

export async function enrollStudentAction(
  classId: string,
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'class:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const parsed = enrollStudentSchema.safeParse({ studentId: formData.get('studentId') });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.studentId?.[0] ?? 'Data tidak valid' };
  }

  const result = await classService.enrollStudent(
    profile.organization_id,
    classId,
    parsed.data.studentId,
  );
  revalidatePath(`/dashboard/kelas/${classId}`);
  return result;
}

export async function unenrollStudentAction(
  classId: string,
  enrollmentId: string,
): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'class:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await classService.unenrollStudent(enrollmentId);
  revalidatePath(`/dashboard/kelas/${classId}`);
  return result;
}