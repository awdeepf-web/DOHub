'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateBrandingAction } from '@/features/branding/branding.actions';
import { initialBrandingActionState } from '@/features/branding/branding.types';
import type { Organization } from '@/types/database.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </Button>
  );
}

export function BrandingForm({ organization }: { organization: Organization }) {
  const [state, formAction] = useFormState(updateBrandingAction, initialBrandingActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          Branding berhasil diperbarui.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Nama Bimbel</Label>
          <Input id="name" name="name" defaultValue={organization.name} required />
          {state.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domain Kustom (opsional)</Label>
          <Input
            id="domain"
            name="domain"
            placeholder="www.bimbelkamu.com"
            defaultValue={organization.domain ?? ''}
          />
          <p className="text-xs text-muted-foreground">
            Pengaturan DNS untuk domain kustom dilakukan terpisah di luar sistem ini.
          </p>
        </div>

        <div />

        <div className="space-y-2">
          <Label htmlFor="themePrimaryColor">Warna Utama</Label>
          <div className="flex items-center gap-2">
            <input
              id="themePrimaryColor"
              name="themePrimaryColor"
              type="color"
              defaultValue={organization.theme_primary_color}
              className="h-10 w-14 rounded border"
            />
            <span className="text-sm text-muted-foreground">{organization.theme_primary_color}</span>
          </div>
          {state.fieldErrors?.themePrimaryColor && (
            <p className="text-xs text-destructive">{state.fieldErrors.themePrimaryColor[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="themeSecondaryColor">Warna Sekunder</Label>
          <div className="flex items-center gap-2">
            <input
              id="themeSecondaryColor"
              name="themeSecondaryColor"
              type="color"
              defaultValue={organization.theme_secondary_color}
              className="h-10 w-14 rounded border"
            />
            <span className="text-sm text-muted-foreground">{organization.theme_secondary_color}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialInstagram">Instagram (URL)</Label>
          <Input
            id="socialInstagram"
            name="socialInstagram"
            placeholder="https://instagram.com/..."
            defaultValue={organization.social_instagram ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialFacebook">Facebook (URL)</Label>
          <Input
            id="socialFacebook"
            name="socialFacebook"
            placeholder="https://facebook.com/..."
            defaultValue={organization.social_facebook ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialYoutube">YouTube (URL)</Label>
          <Input
            id="socialYoutube"
            name="socialYoutube"
            placeholder="https://youtube.com/..."
            defaultValue={organization.social_youtube ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialWhatsapp">Nomor WhatsApp</Label>
          <Input
            id="socialWhatsapp"
            name="socialWhatsapp"
            placeholder="628123456789"
            defaultValue={organization.social_whatsapp ?? ''}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Alamat</Label>
          <Input id="address" name="address" defaultValue={organization.address ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telepon</Label>
          <Input id="phone" name="phone" defaultValue={organization.phone ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={organization.email ?? ''} />
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}