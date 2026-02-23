import { Neo4jPlayerRepository } from "../infrastructure/persistence";
import { playersData } from "./data/players";
import { closeDriver } from "../infrastructure/persistence/connection";

const neo4jRepository = new Neo4jPlayerRepository();

async function main() {
    console.log(`🗑️  Deleting all teams...`);
    let success = 0;
    let failed = 0;
    for (const player of playersData) {
        try {
            await neo4jRepository.delete(player.name)
            console.log(`  ✅ ${player.name} deleted successfully`)
            success++

        } catch (error) {
            console.error(``)
            failed++
        }
    }

    await closeDriver();
    process.exit(0)

}

main()