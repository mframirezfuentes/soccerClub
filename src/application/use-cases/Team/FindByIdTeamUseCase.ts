import { Team } from "../../../domain/entities/Team";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class FindByIdTeamUseCase {
    constructor(private readonly teamRepository: ITeamRepository) { }

    async execute(teamId: string): Promise<Team | null> {
        return await this.teamRepository.findById(teamId)

    }

}