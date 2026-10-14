import type { PrismaClient } from '@prisma/client';
import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';
import type { IPokemonRepository, PokemonFilters } from '@domain/repositories/IPokemonRepository';
import { PokemonMapper } from '../mappers/PokemonMapper';

export class PrismaPokemonRepository implements IPokemonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters: PokemonFilters = {}): Promise<Pokemon[]> {
    const rows = await this.prisma.pokemon.findMany({
      where: {
        ...(filters.type && { types: { has: filters.type } }),
        ...(filters.name && { name: { contains: filters.name, mode: 'insensitive' } }),
      },
      orderBy: { pokedexNumber: 'asc' },
    });
    return rows.map((row) => PokemonMapper.toDomain(row));
  }

  async findById(id: number): Promise<Pokemon | null> {
    const row = await this.prisma.pokemon.findUnique({ where: { id } });
    return row ? PokemonMapper.toDomain(row) : null;
  }

  async findByName(name: string): Promise<Pokemon | null> {
    const row = await this.prisma.pokemon.findUnique({ where: { name } });
    return row ? PokemonMapper.toDomain(row) : null;
  }

  async findByPokedexNumber(pokedexNumber: number): Promise<Pokemon | null> {
    const row = await this.prisma.pokemon.findUnique({ where: { pokedexNumber } });
    return row ? PokemonMapper.toDomain(row) : null;
  }

  async create(data: PokemonProps): Promise<Pokemon> {
    const row = await this.prisma.pokemon.create({ data: PokemonMapper.toPersistence(data) });
    return PokemonMapper.toDomain(row);
  }

  async update(id: number, data: Partial<PokemonProps>): Promise<Pokemon> {
    const row = await this.prisma.pokemon.update({
      where: { id },
      data: PokemonMapper.toPartialPersistence(data),
    });
    return PokemonMapper.toDomain(row);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pokemon.delete({ where: { id } });
  }
}
