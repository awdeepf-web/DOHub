'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateBulkInvoiceAction } from '@/features/invoice/invoice.actions';
import { initialGenerateInvoiceActionState } from '@/features/invoice/invoice.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Memproses...' : 'Generate Invoice untuk Semua Siswa Aktif'}
    </Button>
  );
}

export function GenerateInvoiceForm() {
  const [state, formAction] = useFormState(generateBulkInvoiceAction, initialGenerateInvoiceActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      {state.success && (
        <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          Berhasil! {state.createdCount} invoice baru dibuat.
          {state.skippedCount > 0 &&
            ` ${state.skippedCount} siswa dilewati karena sudah punya invoice di periode ini.`}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="period">Periode</Label>
          <Input id="period" name="period" placeholder="September 2026" required />
          {state.fieldErrors?.period && (
            <p className="text-xs text-destructive">{state.fieldErrors.period[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah SPP (Rp)</Label>
          <Input id="amount" name="amount" type="number" min="1" step="1" required />
          {state.fieldErrors?.amount && (
            <p className="text-xs text-destructive">{state.fieldErrors.amount[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Jatuh Tempo</Label>
          <Input id="dueDate" name="dueDate" type="date" required />
          {state.fieldErrors?.dueDate && (
            <p className="text-xs text-destructive">{state.fieldErrors.dueDate[0]}</p>
          )}
        </div>
      </div>

      <SubmitButton />
      <p className="text-xs text-muted-foreground">
        Siswa yang sudah punya invoice di periode yang sama akan otomatis dilewati (tidak dobel).
      </p>
    </form>
  );
}