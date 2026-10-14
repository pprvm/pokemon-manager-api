import { Router } from 'express';
import type { PokedexController } from '../controllers/PokedexController';
import type { PokemonController } from '../controllers/PokemonController';
import type { TrainerController } from '../controllers/TrainerController';
import { pokedexRoutes } from './pokedex.routes';
import { pokemonRoutes } from './pokemon.routes';
import { trainerRoutes } from './trainer.routes';

interface Controllers {
  pokemonController: PokemonController;
  pokedexController: PokedexController;
  trainerController: TrainerController;
}

export function v1Routes(controllers: Controllers): Router {
  const router = Router();

  router.use('/pokemons', pokemonRoutes(controllers.pokemonController));
  router.use('/pokedex', pokedexRoutes(controllers.pokedexController));
  router.use('/trainers', trainerRoutes(controllers.trainerController));

  return router;
}
