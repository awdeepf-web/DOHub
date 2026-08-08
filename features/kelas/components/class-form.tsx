'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { initialClassActionState, type ClassActionState } from '@/features/kelas/kelas.types';
import type { Class } from '@/types/database.types';

interface TeacherOption {
  id: string;
  fullName: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function ClassForm({
  klass,
  teacherOptions,
  action,
}: {
  klass?: Class;
  teacherOptions: TeacherOption[];
  action: (state: ClassActionState, formData: FormData) => Promise<ClassActionState>;
}) {
  const [state, formAction] = useFormState(action, initialClassActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kelas</Label>
          <Input id="name" name="name" defaultValue={klass?.name} required />
          {state.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Mata Pelajaran</Label>
          <Input id="subject" name="subject" defaultValue={klass?.subject ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teacherId">Guru Pengampu</Label>
          <Select id="teacherId" name="teacherId" defaultValue={klass?.teacher_id ?? ''}>
            <option value="">- Belum ditentukan -</option>
            {teacherOptions.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Kapasitas Siswa</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            defaultValue={klass?.capacity ?? 20}
            required
          />
          {state.fieldErrors?.capacity && (
            <p className="text-xs text-destructive">{state.fieldErrors.capacity[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={klass?.status ?? 'active'} required>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" defaultValue={klass?.notes ?? ''} />
        </div>
      </div>

      <SubmitButton label={klass ? 'Simpan Perubahan' : 'Tambah Kelas'} />
    </form>
  );
}