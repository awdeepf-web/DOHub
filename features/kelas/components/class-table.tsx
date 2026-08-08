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
import { DeleteClassButton } from '@/features/kelas/components/delete-class-button';
import type { ClassWithTeacher } from '@/features/kelas/kelas.types';

export function ClassTable({
  classes,
  canManage,
}: {
  classes: ClassWithTeacher[];
  canManage: boolean;
}) {
  if (classes.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada data kelas.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Kelas</TableHead>
          <TableHead>Mapel</TableHead>
          <TableHead>Guru Pengampu</TableHead>
          <TableHead>Siswa</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((klass) => (
          <TableRow key={klass.id}>
            <TableCell className="font-medium">{klass.name}</TableCell>
            <TableCell>{klass.subject ?? '-'}</TableCell>
            <TableCell>{klass.teacher_name ?? '-'}</TableCell>
            <TableCell>
              {klass.enrolled_count} / {klass.capacity}
            </TableCell>
            <TableCell>
              <Badge variant={klass.status === 'active' ? 'default' : 'secondary'}>
                {klass.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/dashboard/kelas/${klass.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  {canManage ? 'Kelola' : 'Lihat'}
                </Link>
                {canManage && <DeleteClassButton id={klass.id} name={klass.name} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}