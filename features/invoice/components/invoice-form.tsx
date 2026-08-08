'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  initialInvoiceActionState,
  type InvoiceActionState,
} from '@/features/invoice/invoice.types';
import type { Invoice } from '@/types/database.types';

interface StudentOption {
  id: string;
  fullName: string;
  nis: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </Button>
  );
}

export function InvoiceForm({
  invoice,
  studentOptions,
  action,
}: {
  invoice?: Invoice;
  studentOptions: StudentOption[];
  action: (state: InvoiceActionState, formData: FormData) => Promise<InvoiceActionState>;
}) {
  const [state, formAction] = useFormState(action, initialInvoiceActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="studentId">Siswa</Label>
          <Select id="studentId" name="studentId" defaultValue={invoice?.student_id ?? ''} required>
            <option value="" disabled>
              Pilih siswa...
            </option>
            {studentOptions.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName} ({student.nis})
              </option>
            ))}
          </Select>
          {state.fieldErrors?.studentId && (
            <p className="text-xs text-destructive">{state.fieldErrors.studentId[0]}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            name="description"
            placeholder="SPP September 2026"
            defaultValue={invoice?.description}
            required
          />
          {state.fieldErrors?.description && (
            <p className="text-xs text-destructive">{state.fieldErrors.description[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Periode (opsional)</Label>
          <Input id="period" name="period" placeholder="September 2026" defaultValue={invoice?.period ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah (Rp)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            defaultValue={invoice?.amount}
            required
          />
          {state.fieldErrors?.amount && (
            <p className="text-xs text-destructive">{state.fieldErrors.amount[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Jatuh Tempo</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={invoice?.due_date} required />
          {state.fieldErrors?.dueDate && (
            <p className="text-xs text-destructive">{state.fieldErrors.dueDate[0]}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" defaultValue={invoice?.notes ?? ''} />
        </div>
      </div>

      <SubmitButton label={invoice ? 'Simpan Perubahan' : 'Buat Invoice'} />
    </form>
  );
}