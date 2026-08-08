'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { scheduleService } from '@/services/schedule.service';
import { scheduleSchema } from '@/features/jadwal/jadwal.validation';
import {
  initialScheduleActionState,
  type ScheduleActionState,
} from '@/features/jadwal/jadwal.types';

function parseForm(formData: FormData) {
  return {
    classId: formData.get('classId'),
    dayOfWeek: formData.get('dayOfWeek'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    room: formData.get('room'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  };
}

export async function createScheduleAction(
  _prevState: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'schedule:manage');
  } catch (err) {
    return { ...initialScheduleActionState, error: (err as Error).message };
  }

  const parsed = scheduleSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialScheduleActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error, warning } = await scheduleService.create(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialScheduleActionState, error };
  }

  revalidatePath('/dashboard/jadwal');

  if (warning) {
    // Tidak redirect langsung supaya warning sempat terbaca — tapi tetap dianggap sukses tersimpan.
    return { ...initialScheduleActionState, warning, success: true };
  }

  redirect('/dashboard/jadwal');
}

export async function updateScheduleAction(
  id: string,
  _prevState: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'schedule:manage');
  } catch (err) {
    return { ...initialScheduleActionState, error: (err as Error).message };
  }

  const parsed = scheduleSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialScheduleActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error, warning } = await scheduleService.update(
    id,
    profile.organization_id,
    parsed.data,
  );
  if (error) {
    return { ...initialScheduleActionState, error };
  }

  revalidatePath('/dashboard/jadwal');

  if (warning) {
    return { ...initialScheduleActionState, warning, success: true };
  }

  redirect('/dashboard/jadwal');
}

export async function deleteScheduleAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'schedule:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await scheduleService.remove(id);
  revalidatePath('/dashboard/jadwal');
  return result;
}