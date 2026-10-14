import type { PokemonProps } from '@domain/entities/Pokemon';

// Alguns pokémons só pra API não subir vazia em desenvolvimento
export const initialPokemons: PokemonProps[] = [
  {
    pokedexNumber: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    height: 7,
    weight: 69,
    baseStats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  {
    pokedexNumber: 4,
    name: 'charmander',
    types: ['fire'],
    height: 6,
    weight: 85,
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    pokedexNumber: 7,
    name: 'squirtle',
    types: ['water'],
    height: 5,
    weight: 90,
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43,
    },
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  },
  {
    pokedexNumber: 25,
    name: 'pikachu',
    types: ['electric'],
    height: 4,
    weight: 60,
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
    },
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
];
