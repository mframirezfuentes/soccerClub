import { Player } from "../../../domain/entities/Player";
import { IFilterPlayer } from "../../../domain/repositories/IFilterPlayer";
import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";

export class ListOfPlayerUserCase {
    constructor(private readonly playerRepository: IPlayerRepository) { }

    async execute(filters: IFilterPlayer): Promise<Player[]> {
        return await this.playerRepository.findAll(filters);

    }
}