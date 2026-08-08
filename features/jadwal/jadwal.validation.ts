import { z } from 'zod';

export const scheduleSchema = z
  .object({
    classId: z.string().min(1, 'Pilih kelas'),
    dayOfWeek: z.enum(
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      { errorMap: () => ({ message: 'Pilih hari' }) },
    ),
    startTime: z.string().min(1, 'Jam mulai wajib diisi'),
    endTime: z.string().min(1, 'Jam selesai wajib diisi'),
    room: z.string().max(50).optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']),
    notes: z.string().max(500).optional().or(z.literal('')),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'Jam selesai harus lebih besar dari jam mulai',
    path: ['endTime'],
  });

export type ScheduleInput = z.infer<typeof scheduleSchema>;