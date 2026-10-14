import { z } from 'zod';

export const createTrainerSchema = z.strictObject({
  name: z.string().trim().min(2, 'O nome precisa ter pelo menos 2 caracteres').max(80),
  email: z.email('E-mail inválido').max(120),
});

export const capturePokemonSchema = z.strictObject({
  pokemonName: z
    .string()
    .trim()
    .min(1, 'Informe o nome do pokémon')
    .max(50)
    .regex(/^[a-zA-Z0-9-]+$/, 'Use o nome como na Pokédex (ex: pikachu, mr-mime)'),
  nickname: z.string().trim().max(30).nullish(),
});
