'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileSettingsAction } from '@/features/settings/settings.actions';
import { initialSettingsActionState } from '@/features/settings/settings.types';
import type { Profile } from '@/types/database.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan Profil'}
    </Button>
  );
}

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState(updateProfileSettingsAction, initialSettingsActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">Profil berhasil diperbarui.</p>
      )}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={profile.email} disabled />
        <p className="text-xs text-muted-foreground">Email tidak bisa diubah di sini.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input id="fullName" name="fullName" defaultValue={profile.full_name} required />
        {state.fieldErrors?.fullName && (
          <p className="text-xs text-destructive">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">No. HP</Label>
        <Input id="phone" name="phone" defaultValue={profile.phone ?? ''} />
      </div>

      <SubmitButton />
    </form>
  );
}