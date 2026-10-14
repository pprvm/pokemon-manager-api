import type { Pokemon as PrismaPokemon, Prisma } from '@prisma/client';
import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';

// O banco guarda os atributos em colunas separadas; o domínio usa o objeto baseStats
export const PokemonMapper = {
  toDomain(row: PrismaPokemon): Pokemon {
    return {
      id: row.id,
      pokedexNumber: row.pokedexNumber,
      name: row.name,
      types: row.types,
      height: row.height,
      weight: row.weight,
      baseStats: {
        hp: row.hp,
        attack: row.attack,
        defense: row.defense,
        specialAttack: row.specialAttack,
        specialDefense: row.specialDefense,
        speed: row.speed,
      },
      spriteUrl: row.spriteUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  toPersistence(data: PokemonProps): Prisma.PokemonCreateInput {
    const { baseStats, ...rest } = data;
    return { ...rest, ...baseStats };
  },

  toPartialPersistence(data: Partial<PokemonProps>): Prisma.PokemonUpdateInput {
    const { baseStats, ...rest } = data;
    return { ...rest, ...baseStats };
  },
};
