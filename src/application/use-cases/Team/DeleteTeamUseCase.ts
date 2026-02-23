import { Neo4jTeamRepository } from "../../../infrastructure/persistence";

export class DeleteTeamUseCase {
    constructor(private readonly teamRepository: Neo4jTeamRepository) { }

    async execute(id: string): Promise<void> {
        await this.teamRepository.delete(id);
    }
}