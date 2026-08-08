import type { InvoiceStatus } from '@/types/database.types';

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'unpaid', label: 'Belum Bayar' },
  { value: 'paid', label: 'Lunas' },
  { value: 'overdue', label: 'Terlambat' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const STATUS_LABEL_MAP: Record<InvoiceStatus, string> = {
  unpaid: 'Belum Bayar',
  paid: 'Lunas',
  overdue: 'Terlambat',
  cancelled: 'Dibatalkan',
};

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  return STATUS_LABEL_MAP[status];
}

export function getInvoiceStatusBadgeVariant(
  status: InvoiceStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'paid':
      return 'default';
    case 'unpaid':
      return 'secondary';
    case 'overdue':
      return 'destructive';
    case 'cancelled':
      return 'outline';
    default:
      return 'outline';
  }
}

/**
 * Cek apakah invoice sudah lewat jatuh tempo tapi belum ditandai overdue.
 * Dipakai untuk highlight visual di tabel (bukan mengubah data di database).
 */
export function isPastDue(dueDate: string, status: InvoiceStatus): boolean {
  if (status !== 'unpaid') return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}