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
import { DeleteStudentButton } from '@/features/siswa/components/delete-student-button';
import type { Student, UserRole } from '@/types/database.types';
import { hasPermission } from '@/utils/rbac';

export function StudentTable({ students, role }: { students: Student[]; role: UserRole }) {
  const canManage = hasPermission(role, 'student:manage');

  if (students.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada data siswa.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NIS</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Jenis Kelamin</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Orang Tua/Wali</TableHead>
          {canManage && <TableHead className="text-right">Aksi</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.nis}</TableCell>
            <TableCell className="font-medium">{student.full_name}</TableCell>
            <TableCell>{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
            <TableCell>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </TableCell>
            <TableCell>{student.parent_name ?? '-'}</TableCell>
            {canManage && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/siswa/${student.id}`}
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  >
                    Edit
                  </Link>
                  <DeleteStudentButton id={student.id} name={student.full_name} />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}