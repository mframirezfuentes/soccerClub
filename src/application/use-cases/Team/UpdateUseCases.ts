import { Neo4jTeamRepository } from "../../../infrastructure/persistence";
import { Team } from "../../../domain/entities/Team";

export class UpdateTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(id: string, teamData: Partial<Team>): Promise<Team | null> {
        const existingTeam = await this.teamRepository.findById(id);
        if (!existingTeam) {
            return null;
        }

        const updatedTeam = { ...existingTeam, ...teamData };
        return await this.teamRepository.update(id, updatedTeam);

    }
}