import { Player } from '../domain/entities/Player';
import { Neo4jPlayerRepository } from '../infrastructure/persistence/Neo4jPlayerRepository';
import { closeDriver } from '../infrastructure/persistence/connection';
import { v4 as uuidv4 } from 'uuid';
import { playersData } from './data/players';

const playerRepository = new Neo4jPlayerRepository();

async function main() {
    console.log(`⚽ Loading ${playersData.length} players...`);

    let success = 0;
    let failed = 0;

    for (const playerData of playersData) {
        try {
            const exists = await playerRepository.findById(playerData.name);
            if (exists) {
                console.log(`  ⏭️  ${playerData.name} already exists, skipping...`);
                continue;
            }

            const player = new Player(uuidv4(), playerData.name, playerData.age, playerData.position, playerData.teamId, playerData.country);
            await playerRepository.save(player);
            console.log(`  ✅ ${playerData.name} saved successfully`);
            success++;
        } catch (error) {
            console.error(`  ❌ Failed to save ${playerData.name}:`, error);
            failed++;
        }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`  Saved:  ${success}`);
    console.log(`  Failed: ${failed}`);

    // Always close the driver to avoid hanging processes
    await closeDriver();
    process.exit(0);
}

main().catch(error => {
    console.error("Error loading players:", error);
    process.exit(1);
});