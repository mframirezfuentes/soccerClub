import { Neo4jTeamRepository } from "../../../infrastructure/persistence";
import { Team } from "../../../domain/entities/Team";

export class UpdateTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(teamName: string, teamData: Partial<Team>): Promise<Team | null> {
        const existingTeam = await this.teamRepository.findByName(teamName);
        if (!existingTeam) {
            return null;
        }

        const updatedTeam = { ...existingTeam, ...teamData };
        await this.teamRepository.update(teamName, updatedTeam);
        return updatedTeam;
    }
}