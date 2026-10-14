import { Router } from 'express';
import type { TrainerController } from '../controllers/TrainerController';

export function trainerRoutes(controller: TrainerController): Router {
  const router = Router();

  router.post('/', controller.create);
  router.post('/:trainerId/captures', controller.capture);
  router.get('/:trainerId/team', controller.getTeam);

  return router;
}
