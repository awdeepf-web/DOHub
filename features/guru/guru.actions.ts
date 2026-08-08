'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { teacherService } from '@/services/teacher.service';
import { createTeacherSchema, updateTeacherSchema } from '@/features/guru/guru.validation';
import {
  initialTeacherActionState,
  type TeacherActionState,
} from '@/features/guru/guru.types';

export async function createTeacherAction(
  _prevState: TeacherActionState,
  formData: FormData,
): Promise<TeacherActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'teacher:manage');
  } catch (err) {
    return { ...initialTeacherActionState, error: (err as Error).message };
  }

  const parsed = createTeacherSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    subjects: formData.get('subjects'),
    hourlyRate: formData.get('hourlyRate'),
    joinDate: formData.get('joinDate'),
    bio: formData.get('bio'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { ...initialTeacherActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await teacherService.create(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialTeacherActionState, error };
  }

  revalidatePath('/dashboard/guru');
  redirect('/dashboard/guru');
}

export async function updateTeacherAction(
  teacherId: string,
  profileId: string,
  _prevState: TeacherActionState,
  formData: FormData,
): Promise<TeacherActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'teacher:manage');
  } catch (err) {
    return { ...initialTeacherActionState, error: (err as Error).message };
  }

  const parsed = updateTeacherSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    subjects: formData.get('subjects'),
    hourlyRate: formData.get('hourlyRate'),
    joinDate: formData.get('joinDate'),
    bio: formData.get('bio'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { ...initialTeacherActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await teacherService.update(teacherId, profileId, parsed.data);
  if (error) {
    return { ...initialTeacherActionState, error };
  }

  revalidatePath('/dashboard/guru');
  redirect('/dashboard/guru');
}

export async function deleteTeacherAction(
  teacherId: string,
  profileId: string,
): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'teacher:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await teacherService.remove(teacherId, profileId);
  revalidatePath('/dashboard/guru');
  return result;
}