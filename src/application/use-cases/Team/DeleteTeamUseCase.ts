import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";

export class DeleteTeamUseCase {
    constructor(private readonly teamRepository: ITeamRepository) { }

    async execute(id: string): Promise<void> {
        await this.teamRepository.delete(id);
    }
}