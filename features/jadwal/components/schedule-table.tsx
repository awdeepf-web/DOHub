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
import { DeleteScheduleButton } from '@/features/jadwal/components/delete-schedule-button';
import { getDayLabel, formatTime } from '@/utils/schedule';
import type { ScheduleWithClass } from '@/features/jadwal/jadwal.types';

export function ScheduleTable({
  schedules,
  canManage,
}: {
  schedules: ScheduleWithClass[];
  canManage: boolean;
}) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada jadwal kelas.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hari</TableHead>
          <TableHead>Jam</TableHead>
          <TableHead>Kelas</TableHead>
          <TableHead>Guru</TableHead>
          <TableHead>Ruangan</TableHead>
          <TableHead>Status</TableHead>
          {canManage && <TableHead className="text-right">Aksi</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell className="font-medium">{getDayLabel(schedule.day_of_week)}</TableCell>
            <TableCell>
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </TableCell>
            <TableCell>{schedule.class_name}</TableCell>
            <TableCell>{schedule.teacher_name ?? '-'}</TableCell>
            <TableCell>{schedule.room ?? '-'}</TableCell>
            <TableCell>
              <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                {schedule.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </TableCell>
            {canManage && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/jadwal/${schedule.id}`}
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  >
                    Edit
                  </Link>
                  <DeleteScheduleButton
                    id={schedule.id}
                    label={`${schedule.class_name} - ${getDayLabel(schedule.day_of_week)}`}
                  />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}