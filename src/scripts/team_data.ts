import { teamsData } from './data/teams'
import { Neo4jTeamRepository } from '../infrastructure/persistence/Neo4jTeamRepository';
import { closeDriver } from '../infrastructure/persistence/connection';
import { Team } from '../domain/entities/Team';
import { v4 as uuid } from 'uuid'



const repo = new Neo4jTeamRepository();

async function main() {
    console.log(`⚽ Loading ${teamsData.length} teams...`);
    let success = 0;
    let failed = 0;

    for (const team of teamsData) {
        try {
            const teamsCreate = new Team(uuid(), team.name, team.city, team.country, team.stadium)
            await repo.create(teamsCreate);
            success++
            continue;

        } catch (error) {
            console.error(`Error to save a ${team.name}:`, error);
            failed++;
            continue;
        }
    }

    // ✅ Resumen final
    console.log(`\n📊 Summary:`);
    console.log(`  Created:  ${success}`);
    console.log(`  Fallidas: ${failed}`);

    // ✅ Siempre cerrar el driver
    await closeDriver();
    process.exit(0);

}
main()