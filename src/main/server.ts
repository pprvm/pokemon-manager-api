import { env } from './config/env';
import { createApp } from './app';
import { buildContainer } from './container';

const app = createApp(buildContainer());

app.listen(env.port, () => {
  console.info(`PokéManager API rodando em http://localhost:${env.port}`);
  console.info(`Documentação: http://localhost:${env.port}/api/docs`);
});
