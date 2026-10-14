-- CreateEnum
CREATE TYPE "pokemon_type" AS ENUM ('normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy');

-- CreateTable
CREATE TABLE "pokemons" (
    "id" SERIAL NOT NULL,
    "pokedex_number" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "types" "pokemon_type"[],
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "hp" SMALLINT NOT NULL,
    "attack" SMALLINT NOT NULL,
    "defense" SMALLINT NOT NULL,
    "special_attack" SMALLINT NOT NULL,
    "special_defense" SMALLINT NOT NULL,
    "speed" SMALLINT NOT NULL,
    "sprite_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "captures" (
    "id" UUID NOT NULL,
    "trainer_id" UUID NOT NULL,
    "pokedex_number" INTEGER NOT NULL,
    "pokemon_name" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(30),
    "types" "pokemon_type"[],
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "hp" SMALLINT NOT NULL,
    "attack" SMALLINT NOT NULL,
    "defense" SMALLINT NOT NULL,
    "special_attack" SMALLINT NOT NULL,
    "special_defense" SMALLINT NOT NULL,
    "speed" SMALLINT NOT NULL,
    "sprite_url" TEXT,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "captures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_pokedex_number_key" ON "pokemons"("pokedex_number");

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_name_key" ON "pokemons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_email_key" ON "trainers"("email");

-- CreateIndex
CREATE INDEX "captures_trainer_id_idx" ON "captures"("trainer_id");

-- AddForeignKey
ALTER TABLE "captures" ADD CONSTRAINT "captures_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
