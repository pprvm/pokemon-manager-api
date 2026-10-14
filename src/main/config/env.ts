import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida (veja o .env.example)`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: required('DATABASE_URL'),
  pokeApiBaseUrl: process.env.POKEAPI_BASE_URL ?? 'https://pokeapi.co/api/v2',
};
