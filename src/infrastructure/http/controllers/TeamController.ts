import { Request, Response } from 'express';
import { FindByTeamUseCase, ListTeamsUseCase } from '../../../application/use-cases/Team/index';

export class TeamController {
    constructor(private readonly listTeamsUseCase: ListTeamsUseCase, private readonly findByTeamUseCase: FindByTeamUseCase) {
        this.listTeamsUseCase = listTeamsUseCase;
        this.findByTeamUseCase = findByTeamUseCase;
    }
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.listTeamsUseCase.execute();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }


    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const teamName = req.params.name.toString();
            const result = await this.findByTeamUseCase.execute(teamName);
            if (!result) {
                res.status(400).json({ error: `Team ${teamName} not found` });
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
            const result = await this.findByTeamUseCase.execute(teamData.name);
            if (result) {
                res.status(400).json({ error: 'Team already exists' });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const teamName = req.params.name.toString();
            const teamData = req.body;
            const result = await this.findByTeamUseCase.execute(teamName);
            if (!result) {
                res.status(404).json({ error: 'Team not found' });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}