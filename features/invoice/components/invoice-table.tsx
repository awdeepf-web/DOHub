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
import { MarkPaidButton } from '@/features/invoice/components/mark-paid-button';
import { DeleteInvoiceButton } from '@/features/invoice/components/delete-invoice-button';
import {
  getInvoiceStatusLabel,
  getInvoiceStatusBadgeVariant,
  isPastDue,
} from '@/utils/invoice';
import { formatCurrency, formatDateID } from '@/utils/payment';
import type { InvoiceWithStudent } from '@/features/invoice/invoice.types';

export function InvoiceTable({ invoices }: { invoices: InvoiceWithStudent[] }) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada invoice.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. Invoice</TableHead>
          <TableHead>Siswa</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Jatuh Tempo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => {
          const overdue = isPastDue(invoice.due_date, invoice.status);
          return (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-xs">{invoice.invoice_number}</TableCell>
              <TableCell className="font-medium">
                {invoice.student_name}
                <div className="text-xs text-muted-foreground">{invoice.student_nis}</div>
              </TableCell>
              <TableCell>{invoice.description}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell className={overdue ? 'font-medium text-destructive' : undefined}>
                {formatDateID(invoice.due_date)}
              </TableCell>
              <TableCell>
                <Badge variant={overdue ? 'destructive' : getInvoiceStatusBadgeVariant(invoice.status)}>
                  {overdue ? 'Terlambat' : getInvoiceStatusLabel(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {invoice.status === 'unpaid' && (
                    <MarkPaidButton id={invoice.id} invoiceNumber={invoice.invoice_number} />
                  )}
                  <Link
                    href={`/dashboard/invoice/${invoice.id}`}
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  >
                    Edit
                  </Link>
                  <DeleteInvoiceButton id={invoice.id} invoiceNumber={invoice.invoice_number} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}