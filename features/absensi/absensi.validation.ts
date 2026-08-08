import { z } from 'zod';

export const classDateSelectSchema = z.object({
  classId: z.string().min(1, 'Pilih kelas'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal tidak valid'),
});

export type ClassDateSelectInput = z.infer<typeof classDateSelectSchema>;

export const ATTENDANCE_STATUS_VALUES = ['hadir', 'izin', 'sakit', 'alpha'] as const;