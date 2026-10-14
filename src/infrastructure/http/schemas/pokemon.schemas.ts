import { z } from 'zod';
import { POKEMON_TYPES } from '@domain/value-objects/PokemonType';

const stat = z.number().int().min(1).max(255);

const baseStatsSchema = z.strictObject({
  hp: stat,
  attack: stat,
  defense: stat,
  specialAttack: stat,
  specialDefense: stat,
  speed: stat,
});

const pokemonTypeSchema = z.enum(POKEMON_TYPES, { error: 'Tipo de pokémon inválido' });

export const createPokemonSchema = z.strictObject({
  pokedexNumber: z.number().int().positive(),
  name: z.string().trim().min(1).max(50),
  types: z
    .array(pokemonTypeSchema)
    .min(1, 'Informe pelo menos um tipo')
    .max(2, 'Um pokémon tem no máximo 2 tipos'),
  height: z.number().int().positive(),
  weight: z.number().int().positive(),
  baseStats: baseStatsSchema,
  spriteUrl: z.url().nullish(),
});

export const updatePokemonSchema = createPokemonSchema
  .extend({ baseStats: baseStatsSchema.partial() })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie pelo menos um campo para atualizar',
  });

export const listPokemonsQuerySchema = z.object({
  type: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    pokemonTypeSchema.optional(),
  ),
  name: z.string().trim().min(1).optional(),
});
