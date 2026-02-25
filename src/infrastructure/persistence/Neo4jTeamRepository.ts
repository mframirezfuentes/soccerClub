import { runQuery } from "./connection";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { Team } from "../../domain/entities/Team";
import { IFilterTeam } from "../../domain/repositories/IFilters";

export class Neo4jTeamRepository implements ITeamRepository {
    async findAll(filters: IFilterTeam): Promise<Team[]> {
        // Build conditions dynamically based on provided filters
        const conditions = Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, _]) => `t.${key} = $${key}`)
            .join(' AND ');

        const query = `
        MATCH (t:Team)
        ${conditions ? `WHERE ${conditions}` : ''}
        RETURN t
    `;

        const result = await runQuery(query, filters);
        return result.records.map(record => {
            const node = record.get('t');
            return new Team(
                node.properties.id,
                node.properties.name,
                node.properties.city,
                node.properties.country,
                node.properties.stadium
            );
        });
    }


    async findById(id: string): Promise<Team | null> {
        const query = `MATCH (t:Team {id: $id}) return t`
        const result = await runQuery(query, { id })
        if (result.records.length === 0) {
            return null;
        }
        const node = result.records[0].get('t');
        return new Team(
            node.properties.id,
            node.properties.name,
            node.properties.city,
            node.properties.country,
            node.properties.stadium)

    }

    async create(team: Team) {
        const query = 'CREATE (t:Team {id: $id, name: $name, city: $city, country: $country, stadium:$stadium}) RETURN t';
        const result = await runQuery(
            query,
            {
                id: team.getId(),
                name: team.getName(),
                city: team.getCity(),
                country: team.getCountry(),
                stadium: team.getStadium()
            });
        return result.records[0].get('t').properties;
    }

    async update(id: string, team: Partial<Team>) {
        const query = 'MATCH (t:Team {id: $id}) SET t += $team RETURN t';
        const result = await runQuery(query, { id, team });
        if (result.records.length === 0) {
            return null;
        }
        return result.records[0].get('t').properties;
    }

    async delete(name: string) {
        const query = 'MATCH (t:Team {name: $name}) DETACH DELETE t';
        await runQuery(query, { name });
    }


}