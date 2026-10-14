import { CreatePokemonUseCase } from '@application/use-cases/pokemon/CreatePokemonUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/pokemon/DeletePokemonUseCase';
import { GetPokemonByIdUseCase } from '@application/use-cases/pokemon/GetPokemonByIdUseCase';
import { ListPokemonsUseCase } from '@application/use-cases/pokemon/ListPokemonsUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/pokemon/UpdatePokemonUseCase';
import { InMemoryPokemonRepository } from '@infra/database/in-memory/InMemoryPokemonRepository';
import { initialPokemons } from '@infra/database/in-memory/seed';
import { PokemonController } from '@infra/http/controllers/PokemonController';

/**
 * Composition root: único lugar que conhece as implementações concretas.
 * Trocar o repositório aqui não muda nada nas camadas de domínio/aplicação.
 */
export function buildContainer() {
  const pokemonRepository = new InMemoryPokemonRepository(initialPokemons);

  const pokemonController = new PokemonController({
    list: new ListPokemonsUseCase(pokemonRepository),
    getById: new GetPokemonByIdUseCase(pokemonRepository),
    create: new CreatePokemonUseCase(pokemonRepository),
    update: new UpdatePokemonUseCase(pokemonRepository),
    remove: new DeletePokemonUseCase(pokemonRepository),
  });

  return { pokemonController };
}

export type Container = ReturnType<typeof buildContainer>;
