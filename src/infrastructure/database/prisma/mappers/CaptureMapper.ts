import type { Capture as PrismaCapture, Prisma } from '@prisma/client';
import type { Capture, CaptureProps } from '@domain/entities/Capture';

export const CaptureMapper = {
  toDomain(row: PrismaCapture): Capture {
    return {
      id: row.id,
      trainerId: row.trainerId,
      pokedexNumber: row.pokedexNumber,
      pokemonName: row.pokemonName,
      nickname: row.nickname,
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
      capturedAt: row.capturedAt,
    };
  },

  toPersistence(data: CaptureProps): Prisma.CaptureUncheckedCreateInput {
    const { baseStats, ...rest } = data;
    return { ...rest, ...baseStats };
  },
};
