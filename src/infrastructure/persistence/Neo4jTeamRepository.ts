import { runQuery } from "./connection";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { Team } from "../../domain/entities/Team";

export class Neo4jTeamRepository implements ITeamRepository {
    async findAll() {
        const query = 'MATCH (t:Team) RETURN t';
        const result = await runQuery(query);
        return result.records.map(record => record.get('t').properties);
    }

    async findByName(name: string) {
        const query = 'MATCH (t:Team {name: $name}) RETURN t';
        const result = await runQuery(query, { name });
        if (result.records.length === 0) {
            return null;
        }
        return result.records[0].get('t').properties;
    }

    async create(team: Team) {
        const query = 'CREATE (t:Team {id: $id, name: $name, city: $city, country: $country}) RETURN t';
        const result = await runQuery(query, { id: team.getId(), name: team.getName(), city: team.getCity(), country: team.getCountry() });
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