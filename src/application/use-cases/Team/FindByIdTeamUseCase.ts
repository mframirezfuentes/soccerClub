import { Team } from "../../../domain/entities/Team";
import { Neo4jTeamRepository } from "../../../infrastructure/persistence";

export class FindByIdTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(teamId: string): Promise<Team | null> {
        return await this.teamRepository.findById(teamId)

    }

}