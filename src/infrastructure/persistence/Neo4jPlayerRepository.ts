import { runQuery } from "./connection";
import { Player } from "../../domain/entities/Player";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class Neo4jPlayerRepository implements IPlayerRepository {
    async save(player: Player): Promise<void> {
        const query = `
            MATCH (t:Team {id: $teamId})
            CREATE (p:Player {id: $id, name: $name, age: $age, position: $position, teamId: $teamId, country: $country})
            CREATE (p)-[:PLAYS_FOR]->(t)
        `;
        const params = {
            id: player.getId(),
            name: player.getName(),
            age: player.getAge(),
            position: player.getPosition(),
            teamId: player.getTeamId(),
            country: player.getCountry()
        };
        await runQuery(query, params);

    }

    async findAll(): Promise<Player[]> {
        const query = `
            MATCH (p:Player)
            RETURN p
        `;
        const result = await runQuery(query);
        return result.records.map(record => {
            const node = record.get('p');
            return new Player(
                node.properties.id,
                node.properties.name,
                node.properties.age.toInt(),
                node.properties.position,
                node.properties.teamId,
                node.properties.country
            );
        });
    }

    async findById(id: string): Promise<Player | null> {
        const query = `
            MATCH (p:Player {id: $id})
            RETURN p
        `;
        const result = await runQuery(query, { id });
        if (result.records.length === 0) {
            return null;
        }
        const node = result.records[0].get('p');
        return new Player(
            node.properties.id,
            node.properties.name,
            node.properties.age.toInt(),
            node.properties.position,
            node.properties.teamId,
            node.properties.country
        );
    }
    async findByName(name: string): Promise<Player | null> {
        const query = `MATCH (p:Player {name: $name}) RETURN p`;
        const result = await runQuery(query, { name })
        if (result.records.length === 0) {
            return null;
        }
        const node = result.records[0].get('p');
        return new Player(
            node.properties.id,
            node.properties.name,
            node.properties.age.toInt(),
            node.properties.position,
            node.properties.teamId,
            node.properties.country
        )
    }

    async update(id: string, player: Player): Promise<void> {

    }

    async delete(name: string): Promise<void> {
        const query = `MATCH (p:Player {name:$name})  DETACH DELETE p`
        await runQuery(query, { name })

    }
};