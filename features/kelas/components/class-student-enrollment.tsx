'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { enrollStudentAction } from '@/features/kelas/kelas.actions';
import { RemoveStudentFromClassButton } from '@/features/kelas/components/remove-student-from-class-button';
import type { EnrolledStudentRow } from '@/features/kelas/kelas.types';

interface StudentOption {
  id: string;
  fullName: string;
  nis: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menambahkan...' : 'Tambahkan'}
    </Button>
  );
}

export function ClassStudentEnrollment({
  classId,
  enrolledStudents,
  availableStudents,
  canManage,
}: {
  classId: string;
  enrolledStudents: EnrolledStudentRow[];
  availableStudents: StudentOption[];
  canManage: boolean;
}) {
  const boundAction = enrollStudentAction.bind(null, classId);
  const [state, formAction] = useFormState(boundAction, { error: null });

  return (
    <div className="space-y-4">
      {canManage && (
        <form action={formAction} className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium" htmlFor="studentId">
              Tambahkan Siswa ke Kelas
            </label>
            <Select id="studentId" name="studentId" defaultValue="">
              <option value="" disabled>
                Pilih siswa...
              </option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} ({student.nis})
                </option>
              ))}
            </Select>
          </div>
          <SubmitButton />
        </form>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      {enrolledStudents.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Belum ada siswa di kelas ini.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIS</TableHead>
              <TableHead>Nama Siswa</TableHead>
              {canManage && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrolledStudents.map((student) => (
              <TableRow key={student.enrollmentId}>
                <TableCell>{student.nis}</TableCell>
                <TableCell className="font-medium">{student.fullName}</TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <RemoveStudentFromClassButton
                      classId={classId}
                      enrollmentId={student.enrollmentId}
                      studentName={student.fullName}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}