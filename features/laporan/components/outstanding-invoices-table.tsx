import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateID } from '@/utils/payment';
import type { OutstandingInvoiceRow } from '@/features/laporan/laporan.types';

export function OutstandingInvoicesTable({ rows }: { rows: OutstandingInvoiceRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Tidak ada tagihan yang belum lunas. 🎉
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. Invoice</TableHead>
          <TableHead>Siswa</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Jatuh Tempo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-mono text-xs">{row.invoiceNumber}</TableCell>
            <TableCell className="font-medium">
              {row.studentName}
              <div className="text-xs text-muted-foreground">{row.studentNis}</div>
            </TableCell>
            <TableCell>{formatCurrency(row.amount)}</TableCell>
            <TableCell className={row.isOverdue ? 'font-medium text-destructive' : undefined}>
              {formatDateID(row.dueDate)}
            </TableCell>
            <TableCell>
              <Badge variant={row.isOverdue ? 'destructive' : 'secondary'}>
                {row.isOverdue ? 'Terlambat' : 'Belum Bayar'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}