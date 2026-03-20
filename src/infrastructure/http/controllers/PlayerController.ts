import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ListOfPlayerUserCase, CreatePlayerUseCase } from "../../../application/use-cases/Player";
import { Player } from "../../../domain/entities/Player";

export class PlayerController {
    constructor(
        private readonly listAllPlayers: ListOfPlayerUserCase,
        private readonly createPlayer: CreatePlayerUseCase
    ) { }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const { name, age, position, country, teamId } = req.query
            const filters = {
                name: name as string | undefined,
                age: age !== undefined ? parseInt(age as string, 10) : undefined,
                position: position as string | undefined,
                country: country as string | undefined,
                teamId: teamId as string | undefined
            }
            const players = await this.listAllPlayers.execute(filters);

            res.status(200).json(players);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async save(req: Request, res: Response) {
        try {
            const { name, age, position, country } = req.body;
            const result = await this.listAllPlayers.execute({ name })
            if (result.length > 0) {
                res.status(400).json({ error: `This player ${name} already exist` })
            }

            const player = new Player(uuidv4(), name, age, position, country);
            await this.createPlayer.execute(player);
            res.status(201).json({ message: `This player ${name} was created successfly` })

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }

    }

    async update(req: Request, res: Response): Promise<void> {

    }
    async delete(req: Request, res: Response): Promise<void> {

    }

}