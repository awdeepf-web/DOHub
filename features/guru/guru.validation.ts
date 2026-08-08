import { z } from 'zod';

export const createTeacherSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter').max(150, 'Nama maksimal 150 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),
  phone: z.string().max(20).optional().or(z.literal('')),
  subjects: z.string().max(255).optional().or(z.literal('')),
  hourlyRate: z.coerce.number().min(0, 'Honor tidak boleh negatif'),
  joinDate: z.string().optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;

export const updateTeacherSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter').max(150, 'Nama maksimal 150 karakter'),
  phone: z.string().max(20).optional().or(z.literal('')),
  subjects: z.string().max(255).optional().or(z.literal('')),
  hourlyRate: z.coerce.number().min(0, 'Honor tidak boleh negatif'),
  joinDate: z.string().optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;