'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { changeUserRoleAction } from '@/features/user-management/user-management.actions';
import { ROLE_LABELS } from '@/utils/rbac';
import type { UserRole } from '@/types/database.types';

const ALL_ROLES: UserRole[] = ['owner', 'admin', 'guru', 'finance'];

export function ChangeRoleSelect({
  profileId,
  currentRole,
  disabled,
}: {
  profileId: string;
  currentRole: UserRole;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(newRole: string) {
    if (newRole === currentRole) return;

    const confirmed = window.confirm(`Ubah role user ini menjadi "${ROLE_LABELS[newRole as UserRole]}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await changeUserRoleAction(profileId, newRole);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Select
      defaultValue={currentRole}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disabled || isPending}
      className="max-w-[160px]"
    >
      {ALL_ROLES.map((role) => (
        <option key={role} value={role}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </Select>
  );
}