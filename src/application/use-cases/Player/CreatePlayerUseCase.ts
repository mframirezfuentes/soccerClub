import { Player } from "../../../domain/entities/Player";
import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";
export class CreatePlayerUseCase {
    constructor(private readonly playerRepository: IPlayerRepository) { }

    async execute(data: Player) {
        await this.playerRepository.save(data);

    }
}