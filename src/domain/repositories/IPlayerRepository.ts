import { Player } from '../entities/Player';

export interface IPlayerRepository {
    save(player: Player): Promise<void>;
    findAll(): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    update(id: string, player: Player): Promise<void>
    delete(id: string): Promise<void>;
}