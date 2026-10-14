import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { initialPokemons } from '../src/infrastructure/database/in-memory/seed';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  for (const { baseStats, ...pokemon } of initialPokemons) {
    await prisma.pokemon.upsert({
      where: { pokedexNumber: pokemon.pokedexNumber },
      update: {},
      create: { ...pokemon, ...baseStats },
    });
  }
  console.info(`Seed concluído: ${initialPokemons.length} pokémons no catálogo`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
