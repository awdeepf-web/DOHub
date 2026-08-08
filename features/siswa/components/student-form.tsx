'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  initialStudentActionState,
  type StudentActionState,
} from '@/features/siswa/siswa.types';
import type { Student } from '@/types/database.types';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function StudentForm({
  student,
  action,
}: {
  student?: Student;
  action: (state: StudentActionState, formData: FormData) => Promise<StudentActionState>;
}) {
  const [state, formAction] = useFormState(action, initialStudentActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nis">NIS</Label>
          <Input id="nis" name="nis" defaultValue={student?.nis} required />
          {state.fieldErrors?.nis && (
            <p className="text-xs text-destructive">{state.fieldErrors.nis[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" name="fullName" defaultValue={student?.full_name} required />
          {state.fieldErrors?.fullName && (
            <p className="text-xs text-destructive">{state.fieldErrors.fullName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select id="gender" name="gender" defaultValue={student?.gender ?? ''} required>
            <option value="" disabled>
              Pilih jenis kelamin
            </option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Select>
          {state.fieldErrors?.gender && (
            <p className="text-xs text-destructive">{state.fieldErrors.gender[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={student?.status ?? 'active'} required>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace">Tempat Lahir</Label>
          <Input id="birthPlace" name="birthPlace" defaultValue={student?.birth_place ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Tanggal Lahir</Label>
          <Input id="birthDate" name="birthDate" type="date" defaultValue={student?.birth_date ?? ''} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Alamat</Label>
          <Textarea id="address" name="address" defaultValue={student?.address ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">No. HP Siswa</Label>
          <Input id="phone" name="phone" defaultValue={student?.phone ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolOrigin">Asal Sekolah</Label>
          <Input id="schoolOrigin" name="schoolOrigin" defaultValue={student?.school_origin ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentName">Nama Orang Tua/Wali</Label>
          <Input id="parentName" name="parentName" defaultValue={student?.parent_name ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentPhone">No. HP Orang Tua/Wali</Label>
          <Input id="parentPhone" name="parentPhone" defaultValue={student?.parent_phone ?? ''} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" defaultValue={student?.notes ?? ''} />
        </div>
      </div>

      <SubmitButton label={student ? 'Simpan Perubahan' : 'Tambah Siswa'} />
    </form>
  );
}