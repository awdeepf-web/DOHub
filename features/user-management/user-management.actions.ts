'use server';

import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/utils/guard';
import { userManagementService } from '@/services/user-management.service';
import { changeRoleSchema } from '@/features/user-management/user-management.validation';
import type { UserRole } from '@/types/database.types';

function assertOwner(role: UserRole): void {
  if (role !== 'owner') {
    throw new Error('Hanya Owner yang boleh mengelola user');
  }
}

export async function changeUserRoleAction(
  targetProfileId: string,
  newRole: string,
): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertOwner(profile.role);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const parsed = changeRoleSchema.safeParse({ profileId: targetProfileId, role: newRole });
  if (!parsed.success) {
    return { error: 'Role tidak valid' };
  }

  const result = await userManagementService.changeRole(targetProfileId, profile.id, parsed.data.role);
  revalidatePath('/dashboard/users');
  return result;
}

export async function toggleUserActiveAction(
  targetProfileId: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const profile = await requireProfile();

  try {
    assertOwner(profile.role);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const result = await userManagementService.toggleActive(targetProfileId, profile.id, isActive);
  revalidatePath('/dashboard/users');
  return result;
}