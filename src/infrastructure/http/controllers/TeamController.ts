import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '../../../domain/entities/Team';
import {
    ListTeamsUseCase,
    DeleteTeamUseCase,
    UpdateTeamUseCase,
    FindByIdTeamUseCase,
    CreateTeamUseCase
} from '../../../application/use-cases/Team/index';

export class TeamController {
    constructor(
        private readonly createTeamUseCase: CreateTeamUseCase,
        private readonly listTeamsUseCase: ListTeamsUseCase,
        private readonly findByIdTeamUseCase: FindByIdTeamUseCase,
        private readonly deleteTeamUseCase: DeleteTeamUseCase,
        private readonly updateTeamUseCase: UpdateTeamUseCase) { }
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const { name, city, country, stadium } = req.query;

            const filters = {
                name: name as string | undefined,
                city: city as string | undefined,
                country: country as string | undefined,
                stadium: stadium as string | undefined,
            };

            const result = await this.listTeamsUseCase.execute(filters);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const teamId = req.params.id.toString();

            const result = await this.findByIdTeamUseCase.execute(teamId);
            if (!result) {
                res.status(400).json({ error: `Team ${teamId} not found` });
                return
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async save(req: Request, res: Response): Promise<void> {
        try {
            const { name, city, country, stadium } = req.body;
            const result = await this.listTeamsUseCase.execute({ name });
            if (result.length > 0) {
                res.status(400).json({ error: `Team ${name} already exists` });
                return;
            }
            const team = new Team(uuidv4(), name, city, country, stadium);
            await this.createTeamUseCase.execute(team);
            res.status(201).json({ message: `Team ${name} created successfully` });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const teamName = req.params.name.toString();
            const teamData = req.body;
            const result = await this.updateTeamUseCase.execute(teamName, teamData);

            if (!result) {
                res.status(404).json({ error: 'Team not found' });
                return;
            }

            res.status(200).json(`Team ${teamName} updated modificate successfully `);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            await this.deleteTeamUseCase.execute(id.toString())
            res.status(200).json(`Team delete successfully`)

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}