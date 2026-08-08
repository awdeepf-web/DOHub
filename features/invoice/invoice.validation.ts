import { z } from 'zod';

export const invoiceSchema = z.object({
  studentId: z.string().min(1, 'Pilih siswa'),
  description: z.string().min(3, 'Deskripsi minimal 3 karakter').max(200),
  period: z.string().max(50).optional().or(z.literal('')),
  amount: z.coerce.number().min(1, 'Jumlah harus lebih besar dari 0'),
  dueDate: z.string().min(1, 'Tanggal jatuh tempo wajib diisi'),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const generateInvoiceSchema = z.object({
  period: z.string().min(3, 'Isi periode, contoh: September 2026'),
  amount: z.coerce.number().min(1, 'Jumlah harus lebih besar dari 0'),
  dueDate: z.string().min(1, 'Tanggal jatuh tempo wajib diisi'),
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;