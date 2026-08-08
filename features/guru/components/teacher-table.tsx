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
import { DeleteTeacherButton } from '@/features/guru/components/delete-teacher-button';
import type { TeacherWithProfile } from '@/features/guru/guru.types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    value,
  );
}

export function TeacherTable({ teachers }: { teachers: TeacherWithProfile[] }) {
  if (teachers.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada data guru.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mata Pelajaran</TableHead>
          <TableHead>Honor/Jam</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((teacher) => (
          <TableRow key={teacher.id}>
            <TableCell className="font-medium">{teacher.full_name}</TableCell>
            <TableCell>{teacher.email}</TableCell>
            <TableCell>{teacher.subjects ?? '-'}</TableCell>
            <TableCell>{formatCurrency(teacher.hourly_rate)}</TableCell>
            <TableCell>
              <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                {teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/dashboard/guru/${teacher.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Edit
                </Link>
                <DeleteTeacherButton
                  teacherId={teacher.id}
                  profileId={teacher.profile_id}
                  name={teacher.full_name}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}