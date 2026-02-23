import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";
import { Player } from "../../../domain/entities/Player";
import { Request, Response } from "express";

export class PlayerController {
    constructor(private readonly playerRepository: IPlayerRepository) { }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const players: Player[] = await this.playerRepository.findAll();
            res.status(200).json(players);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async findById(req: Request, res:Response):Promise<void>{
        
    }
}