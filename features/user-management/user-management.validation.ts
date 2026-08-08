import { z } from 'zod';

export const changeRoleSchema = z.object({
  profileId: z.string().min(1),
  role: z.enum(['owner', 'admin', 'guru', 'finance'], {
    errorMap: () => ({ message: 'Role tidak valid' }),
  }),
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;