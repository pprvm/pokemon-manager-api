import type { Request, Response } from 'express';
import type { SearchPokedexUseCase } from '@application/use-cases/pokedex/SearchPokedexUseCase';
import { searchPokedexQuerySchema } from '../schemas/pokedex.schemas';

export class PokedexController {
  constructor(private readonly searchPokedex: SearchPokedexUseCase) {}

  search = async (req: Request, res: Response) => {
    const { name } = searchPokedexQuerySchema.parse(req.query);
    const entry = await this.searchPokedex.execute(name);
    return res.json(entry);
  };
}
