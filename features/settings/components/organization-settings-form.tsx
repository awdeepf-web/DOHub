'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { updateOrganizationSettingsAction } from '@/features/settings/settings.actions';
import { initialSettingsActionState } from '@/features/settings/settings.types';
import type { Organization } from '@/types/database.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan Pengaturan'}
    </Button>
  );
}

export function OrganizationSettingsForm({ organization }: { organization: Organization }) {
  const [state, formAction] = useFormState(updateOrganizationSettingsAction, initialSettingsActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          Pengaturan organisasi berhasil diperbarui.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="slug">Slug URL Landing Page</Label>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">/l/</span>
          <Input id="slug" name="slug" defaultValue={organization.slug} required className="flex-1" />
        </div>
        {state.fieldErrors?.slug && (
          <p className="text-xs text-destructive">{state.fieldErrors.slug[0]}</p>
        )}
        <p className="text-xs text-destructive">
          Perhatian: mengubah slug akan mengganti URL landing page publik. URL lama tidak akan berfungsi lagi.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive">Status Bimbel</Label>
        <Select id="isActive" name="isActive" defaultValue={String(organization.is_active)} required>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </Select>
        <p className="text-xs text-muted-foreground">
          Jika dinonaktifkan, landing page publik tidak bisa diakses siapapun. Dashboard tetap bisa
          digunakan seperti biasa.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}