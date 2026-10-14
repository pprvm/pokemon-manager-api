import { env } from './config/env';
import { createApp } from './app';
import { buildContainer } from './container';

const container = buildContainer();
const app = createApp(container);

const server = app.listen(env.port, () => {
  console.info(`PokéManager API rodando em http://localhost:${env.port}`);
  console.info(`Documentação: http://localhost:${env.port}/api/docs`);
});

async function shutdown(signal: string) {
  console.info(`${signal} recebido, encerrando...`);
  server.close();
  await container.prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
