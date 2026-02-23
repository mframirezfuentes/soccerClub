import { Team } from "../../../domain/entities/Team";
import { Neo4jTeamRepository } from "../../../infrastructure/persistence/Neo4jTeamRepository";

export class FindByTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) {}

    async execute(teamName: string): Promise<Team | null> {
        return await this.teamRepository.findByName(teamName);
    }
}