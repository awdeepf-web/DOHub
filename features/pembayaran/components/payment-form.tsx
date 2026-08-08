'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  PAYMENT_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '@/utils/payment';
import {
  initialPaymentActionState,
  type PaymentActionState,
} from '@/features/pembayaran/pembayaran.types';
import type { Payment } from '@/types/database.types';

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

export function PaymentForm({
  payment,
  studentOptions,
  action,
}: {
  payment?: Payment;
  studentOptions: StudentOption[];
  action: (state: PaymentActionState, formData: FormData) => Promise<PaymentActionState>;
}) {
  const [state, formAction] = useFormState(action, initialPaymentActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="studentId">Siswa</Label>
          <Select id="studentId" name="studentId" defaultValue={payment?.student_id ?? ''} required>
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

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select id="category" name="category" defaultValue={payment?.category ?? 'monthly_fee'} required>
            {PAYMENT_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Periode (opsional)</Label>
          <Input
            id="period"
            name="period"
            placeholder="Agustus 2026"
            defaultValue={payment?.period ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah (Rp)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            defaultValue={payment?.amount}
            required
          />
          {state.fieldErrors?.amount && (
            <p className="text-xs text-destructive">{state.fieldErrors.amount[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Tanggal Bayar</Label>
          <Input
            id="paymentDate"
            name="paymentDate"
            type="date"
            defaultValue={payment?.payment_date}
            required
          />
          {state.fieldErrors?.paymentDate && (
            <p className="text-xs text-destructive">{state.fieldErrors.paymentDate[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Metode Pembayaran</Label>
          <Select id="method" name="method" defaultValue={payment?.method ?? 'cash'} required>
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={payment?.status ?? 'paid'} required>
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" defaultValue={payment?.notes ?? ''} />
        </div>
      </div>

      <SubmitButton label={payment ? 'Simpan Perubahan' : 'Tambah Pembayaran'} />
    </form>
  );
}