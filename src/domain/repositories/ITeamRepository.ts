import { Team } from "../entities/Team";

export interface ITeamRepository {

    findAll(): Promise<Team[]>;
    findByName(name: string): Promise<Team | null>;
    create(team: Team): Promise<Team>;
    update(id: string, team: Partial<Team>): Promise<Team | null>;
    delete(id: string): Promise<void>;

}