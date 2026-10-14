import { z } from 'zod';

export const searchPokedexQuerySchema = z.object({
  name: z
    .string({ error: 'O parâmetro "name" é obrigatório' })
    .trim()
    .min(1, 'O parâmetro "name" é obrigatório')
    .max(50),
});
