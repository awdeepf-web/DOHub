'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  initialTeacherActionState,
  type TeacherActionState,
  type TeacherWithProfile,
} from '@/features/guru/guru.types';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function TeacherForm({
  teacher,
  action,
}: {
  teacher?: TeacherWithProfile;
  action: (state: TeacherActionState, formData: FormData) => Promise<TeacherActionState>;
}) {
  const [state, formAction] = useFormState(action, initialTeacherActionState);
  const isEdit = Boolean(teacher);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" name="fullName" defaultValue={teacher?.full_name} required />
          {state.fieldErrors?.fullName && (
            <p className="text-xs text-destructive">{state.fieldErrors.fullName[0]}</p>
          )}
        </div>

        {!isEdit && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email (untuk login)</Label>
              <Input id="email" name="email" type="email" required />
              {state.fieldErrors?.email && (
                <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password Awal</Label>
              <Input id="password" name="password" type="password" required />
              {state.fieldErrors?.password && (
                <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimal 8 karakter, mengandung huruf besar dan angka. Beri tahu guru untuk ganti
                password setelah login pertama.
              </p>
            </div>
          </>
        )}

        {isEdit && (
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={teacher?.email} disabled />
            <p className="text-xs text-muted-foreground">
              Email tidak bisa diubah di sini. Atur di menu User Management.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">No. HP</Label>
          <Input id="phone" name="phone" defaultValue={teacher?.phone ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjects">Mata Pelajaran</Label>
          <Input
            id="subjects"
            name="subjects"
            placeholder="Matematika, Fisika"
            defaultValue={teacher?.subjects ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Honor per Jam (Rp)</Label>
          <Input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            min="0"
            step="1000"
            defaultValue={teacher?.hourly_rate ?? 0}
            required
          />
          {state.fieldErrors?.hourlyRate && (
            <p className="text-xs text-destructive">{state.fieldErrors.hourlyRate[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="joinDate">Tanggal Bergabung</Label>
          <Input id="joinDate" name="joinDate" type="date" defaultValue={teacher?.join_date ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={teacher?.status ?? 'active'} required>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio Singkat</Label>
          <Textarea id="bio" name="bio" defaultValue={teacher?.bio ?? ''} />
        </div>
      </div>

      <SubmitButton label={isEdit ? 'Simpan Perubahan' : 'Tambah Guru'} />
    </form>
  );
}