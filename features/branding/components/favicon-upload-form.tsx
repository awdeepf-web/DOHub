'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadFaviconAction } from '@/features/branding/branding.actions';
import { initialLogoUploadState } from '@/features/branding/branding.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Mengunggah...' : 'Unggah Favicon'}
    </Button>
  );
}

export function FaviconUploadForm({ currentFaviconUrl }: { currentFaviconUrl: string | null }) {
  const [state, formAction] = useFormState(uploadFaviconAction, initialLogoUploadState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = state.logoUrl ?? previewUrl ?? currentFaviconUrl;

  return (
    <div className="flex items-center gap-4">
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={displayUrl} alt="Favicon" className="h-12 w-12 rounded border object-contain p-1" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded border text-[10px] text-muted-foreground">
          Kosong
        </div>
      )}

      <form action={formAction} className="flex-1 space-y-2">
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        {state.success && <p className="text-sm text-green-700">Favicon berhasil diperbarui.</p>}

        <div className="space-y-2">
          <Label htmlFor="favicon">Pilih File Favicon (idealnya persegi, misal 32x32px)</Label>
          <input
            id="favicon"
            name="favicon"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreviewUrl(URL.createObjectURL(file));
            }}
            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}