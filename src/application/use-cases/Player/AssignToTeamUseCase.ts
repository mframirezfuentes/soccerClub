import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class AssignToTeamUseCase {
    constructor(
        private readonly playerRepository: IPlayerRepository,
        private readonly teamRepository: ITeamRepository
    ) { }

    async execute(playerId: string, teamId: string, fromYear?: number): Promise<void> {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new Error(`Player ${playerId} not found`);

        const team = await this.teamRepository.findById(teamId);
        if (!team) throw new Error(`Team ${teamId} not found`);

        await this.playerRepository.assignToTeam(playerId, teamId, fromYear);
    }
}