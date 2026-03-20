import { Player } from '../entities/Player';
import { IFilterPlayer } from './IFilterPlayer';

export interface IPlayerRepository {
    save(player: Player): Promise<void>;
    findAll(filters?: IFilterPlayer): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    assignToTeam(playerId: string, teamId: string, fromYear?: number): Promise<void>;
    update(id: string, player: Player): Promise<void>;
    delete(id: string): Promise<void>;
}