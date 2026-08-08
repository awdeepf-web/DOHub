'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile, assertPermission } from '@/utils/guard';
import { landingService } from '@/services/landing.service';
import { sectionSchema } from '@/features/landing/landing.validation';
import {
  initialSectionActionState,
  type SectionActionState,
} from '@/features/landing/landing.types';

function parseForm(formData: FormData) {
  return {
    sectionType: formData.get('sectionType'),
    heading: formData.get('heading'),
    subheading: formData.get('subheading'),
    body: formData.get('body'),
    imageUrl: formData.get('imageUrl'),
    isVisible: formData.get('isVisible'),
  };
}

export async function createSectionAction(
  _prevState: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'landing:manage');
  } catch (err) {
    return { ...initialSectionActionState, error: (err as Error).message };
  }

  const parsed = sectionSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialSectionActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await landingService.create(profile.organization_id, parsed.data);
  if (error) {
    return { ...initialSectionActionState, error };
  }

  revalidatePath('/dashboard/landing');
  redirect('/dashboard/landing');
}

export async function updateSectionAction(
  id: string,
  _prevState: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'landing:manage');
  } catch (err) {
    return { ...initialSectionActionState, error: (err as Error).message };
  }

  const parsed = sectionSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ...initialSectionActionState, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await landingService.update(id, parsed.data);
  if (error) {
    return { ...initialSectionActionState, error };
  }

  revalidatePath('/dashboard/landing');
  redirect('/dashboard/landing');
}

export async function deleteSectionAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'landing:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await landingService.remove(id);
  revalidatePath('/dashboard/landing');
  return result;
}

export async function moveSectionUpAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'landing:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await landingService.moveUp(profile.organization_id, id);
  revalidatePath('/dashboard/landing');
  return result;
}

export async function moveSectionDownAction(id: string): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertPermission(profile, 'landing:manage');
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await landingService.moveDown(profile.organization_id, id);
  revalidatePath('/dashboard/landing');
  return result;
}