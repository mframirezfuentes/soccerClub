import { Player } from '../entities/Player';
import { IFilterPlayer } from './IFilterPlayer';

export interface IPlayerRepository {
    save(player: Player): Promise<void>;
    findAll(filters?: IFilterPlayer): Promise<Player[]>;
    update(id: string, player: Player): Promise<void>
    delete(id: string): Promise<void>;
    findByName(name: string): Promise<Player | null>;
}