import { z } from 'zod';

export const paymentSchema = z.object({
  studentId: z.string().min(1, 'Pilih siswa'),
  category: z.enum(['registration', 'monthly_fee', 'other']),
  period: z.string().max(50).optional().or(z.literal('')),
  amount: z.coerce.number().min(1, 'Jumlah harus lebih besar dari 0'),
  paymentDate: z.string().min(1, 'Tanggal wajib diisi'),
  method: z.enum(['cash', 'transfer', 'other']),
  status: z.enum(['paid', 'pending', 'cancelled']),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type PaymentInput = z.infer<typeof paymentSchema>;