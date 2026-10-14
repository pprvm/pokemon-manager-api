import { Router } from 'express';
import type { PokedexController } from '../controllers/PokedexController';

export function pokedexRoutes(controller: PokedexController): Router {
  const router = Router();
  router.get('/search', controller.search);
  return router;
}
