import { runQuery } from "./connection";
import { int } from 'neo4j-driver'
import { Player } from "../../domain/entities/Player";
import { IFilterPlayer } from "../../domain/repositories/IFilterPlayer";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class Neo4jPlayerRepository implements IPlayerRepository {
    async save(player: Player): Promise<void> {
        const query = `
            CREATE (p:Player {id: $id, name: $name, age: $age, position: $position, country: $country})
            RETURN p;
        `;
        const params = {
            id: player.getId(),
            name: player.getName(),
            age: int(player.getAge()),
            position: player.getPosition(),
            country: player.getCountry()
        };
        await runQuery(query, params);
    }

    async findAll(filters: IFilterPlayer): Promise<Player[]> {
        const { teamId, ...playerFilters } = filters;

        const validEntries = Object.entries(playerFilters)
            .filter(([_, value]) => value !== undefined);

        const conditions = validEntries
            .map(([key, _]) => `p.${key} = $${key}`)
            .join(' AND ');

        const params: Record<string, unknown> = Object.fromEntries(
            validEntries.map(([key, value]) => [key, key === 'age' ? int(value as number) : value])
        );

        if (teamId) params.teamId = teamId;

        const query = `
            MATCH (p:Player)
            ${teamId ? 'MATCH (p)-[:PLAYS_FOR]->(ft:Team {id: $teamId})' : ''}
            ${conditions ? `WHERE ${conditions}` : ''}
            OPTIONAL MATCH (p)-[r:PLAYS_FOR]->(t:Team)
            WITH p, COLLECT({ teamId: t.id, fromYear: r.fromYear }) AS teams
            RETURN p, teams
            ORDER BY p.name ASC
        `;

        const result = await runQuery(query, params);
        return result.records.map(record => {
            const node = record.get('p');
            const teams: Array<{ teamId: string; fromYear: number }> = record.get('teams');
            const teamIds = teams
                .filter(t => t.teamId != null)
                .map(t => t.teamId);
            return new Player(
                node.properties.id,
                node.properties.name,
                node.properties.age.toInt(),
                node.properties.position,
                node.properties.country,
                teamIds
            );
        });
    }

    async findById(id: string): Promise<Player | null> {
        const query = `
            MATCH (p:Player {id: $id})
            RETURN p
        `;
        const result = await runQuery(query, { id });
        if (result.records.length === 0) return null;
        const node = result.records[0].get('p');
        return new Player(
            node.properties.id,
            node.properties.name,
            node.properties.age.toInt(),
            node.properties.position,
            node.properties.country
        );
    }

    async assignToTeam(playerId: string, teamId: string, fromYear?: number): Promise<void> {
        const query = `
            MATCH (p:Player {id: $playerId})
            MATCH (t:Team {id: $teamId})
            MERGE (p)-[r:PLAYS_FOR]->(t)
            SET r.fromYear = $fromYear
        `;
        await runQuery(query, { playerId, teamId, fromYear: fromYear ?? null });
    }

    async findByName(name: string): Promise<Player | null> {
        const query = `MATCH (p:Player {name: $name}) RETURN p`;
        const result = await runQuery(query, { name });
        if (result.records.length === 0) return null;
        const node = result.records[0].get('p');
        return new Player(
            node.properties.id,
            node.properties.name,
            node.properties.age,
            node.properties.position,
            node.properties.country
        );
    }

    async update(id: string, player: Player): Promise<void> {

    }

    async delete(idOrName: string): Promise<void> {
        const query = `MATCH (p:Player) WHERE p.id = $idOrName OR p.name = $idOrName DETACH DELETE p`
        await runQuery(query, { idOrName });
    }
};
