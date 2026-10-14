import { z } from 'zod';

export const numericIdParamSchema = z.object({
  id: z.coerce.number().int().positive('O id deve ser um inteiro positivo'),
});

export const trainerIdParamSchema = z.object({
  trainerId: z.uuid('trainerId deve ser um UUID válido'),
});
