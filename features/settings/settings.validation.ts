import { z } from 'zod';

export const profileSettingsSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter').max(150, 'Nama maksimal 150 karakter'),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
      .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const organizationSettingsSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100)
    .refine((value) => slugify(value) === value, {
      message: 'Slug hanya boleh huruf kecil, angka, dan tanda strip (-)',
    }),
  isActive: z.enum(['true', 'false']),
});

export type OrganizationSettingsInput = z.infer<typeof organizationSettingsSchema>;