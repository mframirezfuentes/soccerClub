import { Request, Response } from 'express';
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
        private readonly updateTeamUseCase: UpdateTeamUseCase) {

        this.createTeamUseCase = createTeamUseCase;
        this.listTeamsUseCase = listTeamsUseCase;
        this.deleteTeamUseCase = deleteTeamUseCase;
        this.findByIdTeamUseCase = findByIdTeamUseCase;
    }
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
        console.log("find by id:", req.params.id)
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
            const teamData = req.body;
            const result = await this.createTeamUseCase.execute(teamData);
            if (result) {
                res.status(400).json({ error: 'Team already exists' });
                return;
            }
            res.status(201).json({ message: 'created successfully' })
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

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const result = await this.deleteTeamUseCase.execute(id.toString())
            res.status(200).json(result)

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}