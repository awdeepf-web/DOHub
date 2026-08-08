'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { studentService } from '@/services/student.service';
import { studentSchema } from '@/features/siswa/siswa.validation';
import {
  initialStudentActionState,
  type StudentActionState,
} from '@/features/siswa/siswa.types';

function parseFormData(formData: FormData) {
  return {
    nis: formData.get('nis'),
    fullName: formData.get('fullName'),
    gender: formData.get('gender'),
    birthPlace: formData.get('birthPlace'),
    birthDate: formData.get('birthDate'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    parentName: formData.get('parentName'),
    parentPhone: formData.get('parentPhone'),
    schoolOrigin: formData.get('schoolOrigin'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  };
}

export async function createStudentAction(
  _prevState: StudentActionState,
  formData: FormData,
): Promise<StudentActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'student:manage');
  } catch (err) {
    return { ...initialStudentActionState, error: (err as Error).message };
  }

  const parsed = studentSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ...initialStudentActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await studentService.create(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialStudentActionState, error };
  }

  revalidatePath('/dashboard/siswa');
  redirect('/dashboard/siswa');
}

export async function updateStudentAction(
  id: string,
  _prevState: StudentActionState,
  formData: FormData,
): Promise<StudentActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'student:manage');
  } catch (err) {
    return { ...initialStudentActionState, error: (err as Error).message };
  }

  const parsed = studentSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ...initialStudentActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await studentService.update(id, profile.organization_id, parsed.data);
  if (error) {
    return { ...initialStudentActionState, error };
  }

  revalidatePath('/dashboard/siswa');
  redirect('/dashboard/siswa');
}

export async function deleteStudentAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'student:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await studentService.remove(id);
  revalidatePath('/dashboard/siswa');
  return result;
}