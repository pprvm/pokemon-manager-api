import type { Request, Response } from 'express';
import { isPokemonType } from '@domain/value-objects/PokemonType';
import type {
  CreatePokemonUseCase,
  CreatePokemonInput,
} from '@application/use-cases/pokemon/CreatePokemonUseCase';
import type { DeletePokemonUseCase } from '@application/use-cases/pokemon/DeletePokemonUseCase';
import type { GetPokemonByIdUseCase } from '@application/use-cases/pokemon/GetPokemonByIdUseCase';
import type { ListPokemonsUseCase } from '@application/use-cases/pokemon/ListPokemonsUseCase';
import type {
  UpdatePokemonInput,
  UpdatePokemonUseCase,
} from '@application/use-cases/pokemon/UpdatePokemonUseCase';
import { AppError } from '@shared/errors/AppError';

interface PokemonUseCases {
  list: ListPokemonsUseCase;
  getById: GetPokemonByIdUseCase;
  create: CreatePokemonUseCase;
  update: UpdatePokemonUseCase;
  remove: DeletePokemonUseCase;
}

export class PokemonController {
  constructor(private readonly useCases: PokemonUseCases) {}

  list = async (req: Request, res: Response) => {
    const { type, name } = req.query;

    if (type !== undefined && (typeof type !== 'string' || !isPokemonType(type))) {
      throw new AppError('Filtro "type" inválido', 400, 'INVALID_QUERY');
    }

    const pokemons = await this.useCases.list.execute({
      type,
      name: typeof name === 'string' ? name : undefined,
    });
    return res.json(pokemons);
  };

  getById = async (req: Request, res: Response) => {
    const pokemon = await this.useCases.getById.execute(parseId(req.params.id));
    return res.json(pokemon);
  };

  create = async (req: Request, res: Response) => {
    const pokemon = await this.useCases.create.execute(req.body as CreatePokemonInput);
    return res.status(201).location(`/api/v1/pokemons/${pokemon.id}`).json(pokemon);
  };

  update = async (req: Request, res: Response) => {
    const pokemon = await this.useCases.update.execute(
      parseId(req.params.id),
      req.body as UpdatePokemonInput,
    );
    return res.json(pokemon);
  };

  remove = async (req: Request, res: Response) => {
    await this.useCases.remove.execute(parseId(req.params.id));
    return res.status(204).send();
  };
}

function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('O id deve ser um inteiro positivo', 400, 'INVALID_ID');
  }
  return id;
}
