import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(3, 'Nama kelas minimal 3 karakter').max(100, 'Nama kelas maksimal 100 karakter'),
  teacherId: z.string().optional().or(z.literal('')),
  subject: z.string().max(150).optional().or(z.literal('')),
  capacity: z.coerce.number().int().min(1, 'Kapasitas minimal 1').max(500, 'Kapasitas maksimal 500'),
  status: z.enum(['active', 'inactive']),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type ClassInput = z.infer<typeof classSchema>;

export const enrollStudentSchema = z.object({
  studentId: z.string().min(1, 'Pilih siswa yang akan ditambahkan'),
});

export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;