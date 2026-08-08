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
import Link from 'next/link';
import type { AttendanceHistoryRow } from '@/features/absensi/absensi.types';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr),
  );
}

export function AttendanceHistoryTable({ rows }: { rows: AttendanceHistoryRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada riwayat absensi.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Kelas</TableHead>
          <TableHead>Hadir</TableHead>
          <TableHead>Izin</TableHead>
          <TableHead>Sakit</TableHead>
          <TableHead>Alpha</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.sessionId}>
            <TableCell>{formatDate(row.sessionDate)}</TableCell>
            <TableCell className="font-medium">{row.className}</TableCell>
            <TableCell>
              <Badge variant="default">{row.hadirCount}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{row.izinCount}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{row.sakitCount}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="destructive">{row.alphaCount}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Link
                href={`/dashboard/absensi/ambil?classId=${row.classId}&date=${row.sessionDate}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Lihat/Edit
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}