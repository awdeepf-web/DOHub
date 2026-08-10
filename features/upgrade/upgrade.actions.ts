'use server';

import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/utils/guard';
import { upgradeService } from '@/services/upgrade.service';

export async function upgradeToProAction(): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  if (profile.role !== 'owner') {
    return { error: 'Hanya Owner yang boleh mengubah paket langganan' };
  }

  const result = await upgradeService.setPlan(profile.organization_id, 'pro');
  revalidatePath('/dashboard/upgrade');
  revalidatePath('/dashboard/branding');
  return result;
}

export async function downgradeToFreeAction(): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  if (profile.role !== 'owner') {
    return { error: 'Hanya Owner yang boleh mengubah paket langganan' };
  }

  const result = await upgradeService.setPlan(profile.organization_id, 'free');
  revalidatePath('/dashboard/upgrade');
  revalidatePath('/dashboard/branding');
  return result;
}