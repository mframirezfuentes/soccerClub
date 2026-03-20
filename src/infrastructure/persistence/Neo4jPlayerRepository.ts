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
        console.log("Filters received:", JSON.stringify(filters))
        const validEntries = Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
        const conditions = validEntries
            .map(([key, _]) => `p.${key} = $${key}`)
            .join(' AND ');

        const params = Object.fromEntries(
            validEntries.map(([key, value]) => [key, key === 'age' ? int(value as number) : value])
        )

        const query = `
            MATCH (p:Player)
            ${conditions ? `WHERE ${conditions}` : ''}
            RETURN p
        `;

        const result = await runQuery(query, params);
        return result.records.map(record => {
            const node = record.get('p');
            return new Player(
                node.properties.id,
                node.properties.name,
                node.properties.age,
                node.properties.position,
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
            node.properties.country
        );
    }
    async assignToTeam(playerName: string, teamName: string, fromYear: number): Promise<void> {
        const query = `MATCH(p:Player {name:$playerName})
                    MATCH(t:Team {name:$teamName})
                    CREATE (p)-[:PLAYS_FOR {fromYear:$fromYear}]->(t)`;


        await runQuery(query, { playerName, teamName, fromYear })
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
            node.properties.age,
            node.properties.position,
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