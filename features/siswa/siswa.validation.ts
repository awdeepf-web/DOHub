import { z } from 'zod';

export const studentSchema = z.object({
  nis: z.string().min(1, 'NIS wajib diisi').max(30, 'NIS maksimal 30 karakter'),
  fullName: z.string().min(3, 'Nama minimal 3 karakter').max(150, 'Nama maksimal 150 karakter'),
  gender: z.enum(['L', 'P'], { errorMap: () => ({ message: 'Pilih jenis kelamin' }) }),
  birthPlace: z.string().max(100).optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  parentName: z.string().max(150).optional().or(z.literal('')),
  parentPhone: z.string().max(20).optional().or(z.literal('')),
  schoolOrigin: z.string().max(150).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type StudentInput = z.infer<typeof studentSchema>;