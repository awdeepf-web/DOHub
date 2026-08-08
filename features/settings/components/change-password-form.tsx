'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordAction } from '@/features/settings/settings.actions';
import { initialSettingsActionState } from '@/features/settings/settings.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Ganti Password'}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changePasswordAction, initialSettingsActionState);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          Password berhasil diganti.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="newPassword">Password Baru</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
        {state.fieldErrors?.newPassword && (
          <p className="text-xs text-destructive">{state.fieldErrors.newPassword[0]}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Minimal 8 karakter, mengandung huruf besar dan angka.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}