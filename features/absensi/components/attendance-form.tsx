'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { submitAttendanceAction } from '@/features/absensi/absensi.actions';
import { initialAttendanceActionState } from '@/features/absensi/absensi.types';
import { ATTENDANCE_STATUS_OPTIONS } from '@/utils/attendance';
import type { AttendanceStudentRow } from '@/features/absensi/absensi.types';
import type { AttendanceStatus } from '@/types/database.types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan Absensi'}
    </Button>
  );
}

export function AttendanceForm({
  classId,
  date,
  className,
  students,
  initialSessionNotes,
}: {
  classId: string;
  date: string;
  className: string;
  students: AttendanceStudentRow[];
  initialSessionNotes: string;
}) {
  const boundAction = submitAttendanceAction.bind(null, classId, date);
  const [state, formAction] = useFormState(boundAction, initialAttendanceActionState);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(students.map((student) => [student.studentId, student.defaultStatus])),
  );

  function setAllStatus(status: AttendanceStatus) {
    setStatuses(Object.fromEntries(students.map((student) => [student.studentId, status])));
  }

  if (students.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Kelas &quot;{className}&quot; belum punya siswa terdaftar. Tambahkan siswa ke kelas ini dulu di menu Kelas.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="studentIds" value={students.map((s) => s.studentId).join(',')} />

      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Tandai semua sebagai:</span>
        {ATTENDANCE_STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAllStatus(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIS</TableHead>
            <TableHead>Nama Siswa</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.nis}</TableCell>
              <TableCell className="font-medium">{student.fullName}</TableCell>
              <TableCell>
                <Select
                  name={`status_${student.studentId}`}
                  value={statuses[student.studentId]}
                  onChange={(e) =>
                    setStatuses((prev) => ({
                      ...prev,
                      [student.studentId]: e.target.value as AttendanceStatus,
                    }))
                  }
                  className="max-w-[160px]"
                >
                  {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-2">
        <Label htmlFor="sessionNotes">Catatan Pertemuan (opsional)</Label>
        <Textarea
          id="sessionNotes"
          name="sessionNotes"
          defaultValue={initialSessionNotes}
          placeholder="Misal: materi yang dibahas hari ini"
        />
      </div>

      <SubmitButton />
    </form>
  );
}