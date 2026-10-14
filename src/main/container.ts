import { CapturePokemonUseCase } from '@application/use-cases/capture/CapturePokemonUseCase';
import { SearchPokedexUseCase } from '@application/use-cases/pokedex/SearchPokedexUseCase';
import { CreatePokemonUseCase } from '@application/use-cases/pokemon/CreatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/pokemon/DeletePokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/pokemon/GetPokemonByIdUseCase';
import { ListPokemonsUseCase } from '@application/use-cases/pokemon/ListPokemonsUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/pokemon/UpdatePokemonUseCase';
import { CreateTrainerUseCase } from '@application/use-cases/trainer/CreateTrainerUseCase';
import { GetTrainerTeamUseCase } from '@application/use-cases/trainer/GetTrainerTeamUseCase';
import { createPrismaClient } from '@infra/database/prisma/client';
import { PrismaCaptureRepository } from '@infra/database/prisma/repositories/PrismaCaptureRepository';
import { PrismaPokemonRepository } from '@infra/database/prisma/repositories/PrismaPokemonRepository';
import { PrismaTrainerRepository } from '@infra/database/prisma/repositories/PrismaTrainerRepository';
import { PokedexController } from '@infra/http/controllers/PokedexController';
import { PokemonController } from '@infra/http/controllers/PokemonController';
import { TrainerController } from '@infra/http/controllers/TrainerController';
import { PokeApiGateway } from '@infra/providers/PokeApiGateway';
import { env } from './config/env';

/**
 * Composition root: único lugar que conhece as implementações concretas.
 * Na entrega 1 o catálogo usava o InMemoryPokemonRepository; trocar para o
 * Prisma foi só mudar a linha abaixo, sem mexer em domínio ou casos de uso.
 */
export function buildContainer() {
  const prisma = createPrismaClient(env.databaseUrl);

  const pokemonRepository = new PrismaPokemonRepository(prisma);
  const trainerRepository = new PrismaTrainerRepository(prisma);
  const captureRepository = new PrismaCaptureRepository(prisma);
  const pokeApi = new PokeApiGateway(env.pokeApiBaseUrl);

  const pokemonController = new PokemonController({
    list: new ListPokemonsUseCase(pokemonRepository),
    getById: new GetPokemonByIdUseCase(pokemonRepository),
    create: new CreatePokemonUseCase(pokemonRepository),
    update: new UpdatePokemonUseCase(pokemonRepository),
    remove: new DeletePokemonUseCase(pokemonRepository),
  });

  const pokedexController = new PokedexController(new SearchPokedexUseCase(pokeApi));

  const trainerController = new TrainerController({
    create: new CreateTrainerUseCase(trainerRepository),
    capture: new CapturePokemonUseCase(trainerRepository, captureRepository, pokeApi),
    getTeam: new GetTrainerTeamUseCase(trainerRepository, captureRepository),
  });

  return { prisma, pokemonController, pokedexController, trainerController };
}

export type Container = ReturnType<typeof buildContainer>;
