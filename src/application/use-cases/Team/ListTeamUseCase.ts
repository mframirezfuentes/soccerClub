import { Team } from "../../../domain/entities/Team";
import { IFilterTeam } from "../../../domain/repositories/IFiltersTeam";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class ListTeamsUseCase {
    constructor(private readonly teamRepository: ITeamRepository) { }

    async execute(filters: IFilterTeam): Promise<Team[]> {
        return await this.teamRepository.findAll(filters);


    }
}