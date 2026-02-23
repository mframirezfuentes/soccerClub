import { Team } from "../../../domain/entities/Team";
import { Neo4jTeamRepository } from "../../../infrastructure/persistence/Neo4jTeamRepository";

export class ListTeamsUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) {}

    async execute(teamName?: string): Promise<Team[]> {
        if (teamName) {
            const team = await this.teamRepository.findByName(teamName);
            return team ? [team] : [];
        }
        return await this.teamRepository.findAll();

    }
}