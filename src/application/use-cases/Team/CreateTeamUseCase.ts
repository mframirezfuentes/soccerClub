import { ResultSummary } from "neo4j-driver";
import { Team } from "../../../domain/entities/Team";
import { Neo4jTeamRepository } from "../../../infrastructure/persistence";

export class CreateTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(team: Team): Promise<Team> {
        const result = await this.teamRepository.create(team);
        return result;

    }
}