import type { PaymentCategory, PaymentMethod, PaymentStatus } from '@/types/database.types';

export const PAYMENT_CATEGORY_OPTIONS: { value: PaymentCategory; label: string }[] = [
  { value: 'registration', label: 'Pendaftaran' },
  { value: 'monthly_fee', label: 'SPP Bulanan' },
  { value: 'other', label: 'Lainnya' },
];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Tunai' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'other', label: 'Lainnya' },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'paid', label: 'Lunas' },
  { value: 'pending', label: 'Tertunda' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const CATEGORY_LABEL_MAP: Record<PaymentCategory, string> = {
  registration: 'Pendaftaran',
  monthly_fee: 'SPP Bulanan',
  other: 'Lainnya',
};

const METHOD_LABEL_MAP: Record<PaymentMethod, string> = {
  cash: 'Tunai',
  transfer: 'Transfer',
  other: 'Lainnya',
};

const STATUS_LABEL_MAP: Record<PaymentStatus, string> = {
  paid: 'Lunas',
  pending: 'Tertunda',
  cancelled: 'Dibatalkan',
};

export function getCategoryLabel(category: PaymentCategory): string {
  return CATEGORY_LABEL_MAP[category];
}

export function getMethodLabel(method: PaymentMethod): string {
  return METHOD_LABEL_MAP[method];
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return STATUS_LABEL_MAP[status];
}

export function getPaymentStatusBadgeVariant(
  status: PaymentStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateID(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}