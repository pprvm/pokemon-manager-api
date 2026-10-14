import type { Request, Response } from 'express';
import type { CapturePokemonUseCase } from '@application/use-cases/capture/CapturePokemonUseCase';
import type { CreateTrainerUseCase } from '@application/use-cases/trainer/CreateTrainerUseCase';
import type { GetTrainerTeamUseCase } from '@application/use-cases/trainer/GetTrainerTeamUseCase';
import { trainerIdParamSchema } from '../schemas/common.schemas';
import { capturePokemonSchema, createTrainerSchema } from '../schemas/trainer.schemas';

interface TrainerUseCases {
  create: CreateTrainerUseCase;
  capture: CapturePokemonUseCase;
  getTeam: GetTrainerTeamUseCase;
}

export class TrainerController {
  constructor(private readonly useCases: TrainerUseCases) {}

  create = async (req: Request, res: Response) => {
    const body = createTrainerSchema.parse(req.body);
    const trainer = await this.useCases.create.execute(body);
    return res.status(201).json(trainer);
  };

  capture = async (req: Request, res: Response) => {
    const { trainerId } = trainerIdParamSchema.parse(req.params);
    const { pokemonName, nickname } = capturePokemonSchema.parse(req.body);
    const capture = await this.useCases.capture.execute({ trainerId, pokemonName, nickname });
    return res.status(201).json(capture);
  };

  getTeam = async (req: Request, res: Response) => {
    const { trainerId } = trainerIdParamSchema.parse(req.params);
    const team = await this.useCases.getTeam.execute(trainerId);
    return res.json(team);
  };
}
