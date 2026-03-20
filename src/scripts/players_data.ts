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

    // ✅ Eliminar duplicados por nombre — crear cada jugadora solo una vez
    const uniquePlayers = playersData.filter(
        (player, index, self) => index === self.findIndex(p => p.name === player.name)
    );

    console.log(`\n👤 Creating ${uniquePlayers.length} unique players...`);

    for (const playerData of uniquePlayers) {
        try {
            const exists = await playerRepository.findByName(playerData.name);
            if (exists) {
                console.log(`  ⏭️  ${playerData.name} already exists, skipping...`);
                skipped++;
                continue;
            }

            const player = new Player(uuidv4(), playerData.name, playerData.age, playerData.position, playerData.country);
            await playerRepository.save(player);

            const saved = await playerRepository.findByName(playerData.name);
            if (saved) {
                console.log(`  ✅ ${playerData.name} saved and verified`);
                success++;
            } else {
                console.warn(`  ⚠️  ${playerData.name} — saved without error but not found in Neo4j`);
                failed++;
            }
        } catch (error) {
            console.error(`  ❌ Failed to save ${playerData.name}:`, error);
            failed++;
        }
    }

    // ✅ Crear TODAS las relaciones — incluyendo duplicados (historial)
    console.log(`\n🔗 Creating ${playersData.length} team relationships...`);

    for (const playerData of playersData) {
        try {
            await playerRepository.assignToTeam(playerData.name, playerData.teamName, playerData.from);
            console.log(`  ✅ ${playerData.name} → ${playerData.teamName} (from ${playerData.from})`);
        } catch (error) {
            console.error(`  ❌ Failed to assign ${playerData.name} to ${playerData.teamName}:`, error);
        }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`  Players saved:    ${success}`);
    console.log(`  Players skipped:  ${skipped}`);
    console.log(`  Players failed:   ${failed}`);

    await closeDriver();
    process.exit(0);
}
main()