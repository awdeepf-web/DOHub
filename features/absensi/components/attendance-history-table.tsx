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
import { ClipboardList } from 'lucide-react';
import type { AttendanceHistoryRow } from '@/features/absensi/absensi.types';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr),
  );
}

export function AttendanceHistoryTable({ rows }: { rows: AttendanceHistoryRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="h-7 w-7 text-muted-foreground" />
        </span>
        <p className="text-base font-semibold">Belum Ada Riwayat Absensi</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Mulai catat kehadiran siswa dengan memilih kelas dan tanggal di form di atas, lalu klik
          &quot;Ambil Absensi&quot;.
        </p>
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