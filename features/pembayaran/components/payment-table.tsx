import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { DeletePaymentButton } from '@/features/pembayaran/components/delete-payment-button';
import {
  getCategoryLabel,
  getMethodLabel,
  getPaymentStatusLabel,
  getPaymentStatusBadgeVariant,
  formatCurrency,
  formatDateID,
} from '@/utils/payment';
import type { PaymentWithStudent } from '@/features/pembayaran/pembayaran.types';

export function PaymentTable({ payments }: { payments: PaymentWithStudent[] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada data pembayaran.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Siswa</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Metode</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDateID(payment.payment_date)}</TableCell>
            <TableCell className="font-medium">
              {payment.student_name}
              <div className="text-xs text-muted-foreground">{payment.student_nis}</div>
            </TableCell>
            <TableCell>{getCategoryLabel(payment.category)}</TableCell>
            <TableCell>{payment.period ?? '-'}</TableCell>
            <TableCell>{formatCurrency(payment.amount)}</TableCell>
            <TableCell>{getMethodLabel(payment.method)}</TableCell>
            <TableCell>
              <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
                {getPaymentStatusLabel(payment.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/dashboard/pembayaran/${payment.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Edit
                </Link>
                <DeletePaymentButton
                  id={payment.id}
                  label={`${payment.student_name} - ${formatDateID(payment.payment_date)}`}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}