'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { DAY_OPTIONS } from '@/utils/schedule';
import {
  initialScheduleActionState,
  type ScheduleActionState,
} from '@/features/jadwal/jadwal.types';
import type { ClassSchedule } from '@/types/database.types';

interface ClassOption {
  id: string;
  name: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function ScheduleForm({
  schedule,
  classOptions,
  action,
}: {
  schedule?: ClassSchedule;
  classOptions: ClassOption[];
  action: (state: ScheduleActionState, formData: FormData) => Promise<ScheduleActionState>;
}) {
  const [state, formAction] = useFormState(action, initialScheduleActionState);

  if (state.success && state.warning) {
    return (
      <div className="space-y-4">
        <p className="rounded-md bg-yellow-500/10 p-3 text-sm text-yellow-700">{state.warning}</p>
        <p className="text-sm text-muted-foreground">
          Jadwal tetap tersimpan. Silakan cek kembali jika ini tidak disengaja.
        </p>
        <Link href="/dashboard/jadwal" className="text-sm font-medium text-primary underline underline-offset-4">
          Kembali ke daftar jadwal
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="classId">Kelas</Label>
          <Select id="classId" name="classId" defaultValue={schedule?.class_id ?? ''} required>
            <option value="" disabled>
              Pilih kelas
            </option>
            {classOptions.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name}
              </option>
            ))}
          </Select>
          {state.fieldErrors?.classId && (
            <p className="text-xs text-destructive">{state.fieldErrors.classId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Hari</Label>
          <Select id="dayOfWeek" name="dayOfWeek" defaultValue={schedule?.day_of_week ?? ''} required>
            <option value="" disabled>
              Pilih hari
            </option>
            {DAY_OPTIONS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </Select>
          {state.fieldErrors?.dayOfWeek && (
            <p className="text-xs text-destructive">{state.fieldErrors.dayOfWeek[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Jam Mulai</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={schedule?.start_time?.slice(0, 5)}
            required
          />
          {state.fieldErrors?.startTime && (
            <p className="text-xs text-destructive">{state.fieldErrors.startTime[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Jam Selesai</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={schedule?.end_time?.slice(0, 5)}
            required
          />
          {state.fieldErrors?.endTime && (
            <p className="text-xs text-destructive">{state.fieldErrors.endTime[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Ruangan</Label>
          <Input id="room" name="room" defaultValue={schedule?.room ?? ''} placeholder="Ruang 1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={schedule?.status ?? 'active'} required>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" defaultValue={schedule?.notes ?? ''} />
        </div>
      </div>

      <SubmitButton label={schedule ? 'Simpan Perubahan' : 'Tambah Jadwal'} />
    </form>
  );
}