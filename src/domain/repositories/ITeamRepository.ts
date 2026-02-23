import { Team } from "../entities/Team";
import { IFilterTeam } from './IFilters'

export interface ITeamRepository {

    findAll(filters?: IFilterTeam): Promise<Team[]>;
    findById(id: string): Promise<Team | null>;
    create(team: Team): Promise<Team>;
    update(id: string, team: Partial<Team>): Promise<Team | null>;
    delete(id: string): Promise<void>;

}