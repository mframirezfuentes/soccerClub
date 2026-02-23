import { Team } from "../../../domain/entities/Team";
import { Neo4jTeamRepository } from "../../../infrastructure/persistence/Neo4jTeamRepository";
import { IFilterTeam } from "../../../domain/repositories/IFilters";

export class ListTeamsUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(filters: IFilterTeam): Promise<Team[]> {
        return await this.teamRepository.findAll(filters);


    }
}