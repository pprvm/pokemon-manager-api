import type { Request, Response } from 'express';
import type { CreatePokemonUseCase } from '@application/use-cases/pokemon/CreatePokemonUseCase';
import type { DeletePokemonUseCase } from '@application/use-cases/pokemon/DeletePokemonUseCase';
import type { GetPokemonByIdUseCase } from '@application/use-cases/pokemon/GetPokemonByIdUseCase';
import type { ListPokemonsUseCase } from '@application/use-cases/pokemon/ListPokemonsUseCase';
import type { UpdatePokemonUseCase } from '@application/use-cases/pokemon/UpdatePokemonUseCase';
import { numericIdParamSchema } from '../schemas/common.schemas';
import {
  createPokemonSchema,
  listPokemonsQuerySchema,
  updatePokemonSchema,
} from '../schemas/pokemon.schemas';

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
    const filters = listPokemonsQuerySchema.parse(req.query);
    const pokemons = await this.useCases.list.execute(filters);
    return res.json(pokemons);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = numericIdParamSchema.parse(req.params);
    const pokemon = await this.useCases.getById.execute(id);
    return res.json(pokemon);
  };

  create = async (req: Request, res: Response) => {
    const body = createPokemonSchema.parse(req.body);
    const pokemon = await this.useCases.create.execute(body);
    return res.status(201).location(`/api/v1/pokemons/${pokemon.id}`).json(pokemon);
  };

  update = async (req: Request, res: Response) => {
    const { id } = numericIdParamSchema.parse(req.params);
    const body = updatePokemonSchema.parse(req.body);
    const pokemon = await this.useCases.update.execute(id, body);
    return res.json(pokemon);
  };

  remove = async (req: Request, res: Response) => {
    const { id } = numericIdParamSchema.parse(req.params);
    await this.useCases.remove.execute(id);
    return res.status(204).send();
  };
}
