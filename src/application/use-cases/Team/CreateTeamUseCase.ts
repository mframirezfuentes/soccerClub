import { Team } from "../../../domain/entities/Team";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class CreateTeamUseCase {
    constructor(private readonly teamRepository: ITeamRepository) { }

    async execute(team: Team): Promise<Team> {
        const result = await this.teamRepository.create(team);
        return result;

    }
}