import { z } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

export const brandingSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  domain: z.string().max(255).optional().or(z.literal('')),
  themePrimaryColor: z.string().regex(hexColorRegex, 'Format warna harus HEX, contoh: #0f172a'),
  themeSecondaryColor: z.string().regex(hexColorRegex, 'Format warna harus HEX, contoh: #64748b'),
  socialInstagram: z.string().max(255).optional().or(z.literal('')),
  socialFacebook: z.string().max(255).optional().or(z.literal('')),
  socialYoutube: z.string().max(255).optional().or(z.literal('')),
  socialWhatsapp: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
});

export type BrandingInput = z.infer<typeof brandingSchema>;