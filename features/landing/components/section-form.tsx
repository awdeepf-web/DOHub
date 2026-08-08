'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { SECTION_TYPE_OPTIONS } from '@/utils/landing';
import {
  initialSectionActionState,
  type SectionActionState,
} from '@/features/landing/landing.types';
import type { LandingSection } from '@/types/database.types';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function SectionForm({
  section,
  action,
}: {
  section?: LandingSection;
  action: (state: SectionActionState, formData: FormData) => Promise<SectionActionState>;
}) {
  const [state, formAction] = useFormState(action, initialSectionActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sectionType">Tipe Konten</Label>
          <Select id="sectionType" name="sectionType" defaultValue={section?.section_type ?? 'custom'} required>
            {SECTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isVisible">Tampilkan di Landing Page?</Label>
          <Select id="isVisible" name="isVisible" defaultValue={section ? String(section.is_visible) : 'true'} required>
            <option value="true">Ya, tampilkan</option>
            <option value="false">Sembunyikan</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="heading">Judul</Label>
          <Input id="heading" name="heading" defaultValue={section?.heading} required />
          {state.fieldErrors?.heading && (
            <p className="text-xs text-destructive">{state.fieldErrors.heading[0]}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subheading">Sub-judul (opsional)</Label>
          <Input id="subheading" name="subheading" defaultValue={section?.subheading ?? ''} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="body">Isi Konten</Label>
          <Textarea id="body" name="body" rows={5} defaultValue={section?.body ?? ''} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://..."
            defaultValue={section?.image_url ?? ''}
          />
          {state.fieldErrors?.imageUrl && (
            <p className="text-xs text-destructive">{state.fieldErrors.imageUrl[0]}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Upload gambar ke Supabase Storage terlebih dahulu, lalu tempel URL publiknya di sini.
          </p>
        </div>
      </div>

      <SubmitButton label={section ? 'Simpan Perubahan' : 'Tambah Konten'} />
    </form>
  );
}