import { Request, Response } from "express";
import { ListOfPlayerUserCase } from "../../../application/use-cases/Player";

export class PlayerController {
    constructor(private readonly listAllPlayers: ListOfPlayerUserCase) { }

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

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }

    }

    async update(req: Request, res: Response): Promise<void> {

    }
    async delete(req: Request, res: Response): Promise<void> {

    }

}