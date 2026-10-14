import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from '@infra/http/docs/openapi';
import { errorHandler } from '@infra/http/middlewares/errorHandler';
import { notFound } from '@infra/http/middlewares/notFound';
import { pokemonRoutes } from '@infra/http/routes/pokemon.routes';
import type { Container } from './container';

export function createApp(container: Container) {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/api/v1/pokemons', pokemonRoutes(container.pokemonController));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
