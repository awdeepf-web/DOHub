import { z } from 'zod';

export const sectionSchema = z.object({
  sectionType: z.enum(['hero', 'about', 'features', 'cta', 'contact', 'custom']),
  heading: z.string().min(1, 'Judul wajib diisi').max(200),
  subheading: z.string().max(300).optional().or(z.literal('')),
  body: z.string().max(2000).optional().or(z.literal('')),
  imageUrl: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  isVisible: z.enum(['true', 'false']),
});

export type SectionInput = z.infer<typeof sectionSchema>;