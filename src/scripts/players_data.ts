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
    let skipped = 0;

    for (const playerData of playersData) {
        try {
            const exists = await playerRepository.findByName(playerData.name);
            if (exists) {
                console.log(`  ⏭️  ${playerData.name} already exists, skipping...`);
                skipped++;
                continue;
            }

            const player = new Player(uuidv4(), playerData.name, playerData.age, playerData.position, playerData.teamId, playerData.country);
            await playerRepository.save(player);
            // ✅ Verify the player was actually saved in Neo4j
            const saved = await playerRepository.findByName(playerData.name);
            if (saved) {
                console.log(`  ✅ ${playerData.name} saved and verified`);
                success++;
            } else {
                // Saved without error but not found — likely a MATCH issue (teamId, etc.)
                console.warn(`  ⚠️  ${playerData.name} — no error but not found in Neo4j. Check teamId: "${playerData.teamId}"`);
                failed++;
            }
        } catch (error) {
            console.error(`  ❌ Failed to save ${playerData.name}:`, error);
            failed++;
        }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`  Saved:    ${success}`);
    console.log(`  Skipped:  ${skipped}`);
    console.log(`  Failed:   ${failed}`);


    // Always close the driver to avoid hanging processes
    await closeDriver();
    process.exit(0);
}

main().catch(error => {
    console.error("Error loading players:", error);
    process.exit(1);
});