import { Team } from "../../../domain/entities/Team";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class UpdateTeamUseCase {
    constructor(private readonly teamRepository: ITeamRepository) { }

    async execute(id: string, teamData: Partial<Team>): Promise<Team | null> {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            return null;
        }

        const updatedTeam = { ...existingTeam, ...teamData };
        return await this.teamRepository.update(id, updatedTeam);

    }
}