import { Neo4jTeamRepository } from "../infrastructure/persistence"
import { teamsData } from "./data/teams";
import { closeDriver } from "../infrastructure/persistence/connection";


const neo4jRepository = new Neo4jTeamRepository();


async function main() {
    console.log(`🗑️  Deleting all teams...`);
    let success = 0;
    let failed = 0;

    for (const team of teamsData) {

        try {
            await neo4jRepository.delete(team.name);
            console.log(`  ✅ ${team.name} deleted successfully`)
            success++
        } catch (error) {
            console.error(`❌ Failed to delete ${team.name}:`, error)
            failed++
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Deleted:  ${success}`);
    console.log(`  Failed: ${failed}`);

    // ✅ Siempre cerrar el driver
    await closeDriver();
    process.exit(0);


}

main()
