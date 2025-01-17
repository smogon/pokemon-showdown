/**
 * Not a chat plugin.
 *
 * Handles updating the level database for [Gen 9] Computer-Generated Teams.
 */

import {SQL} from "../../lib";

export let addPokemon: SQL.Statement | null = null;
export let incrementWins: SQL.Statement | null = null;
export let incrementLosses: SQL.Statement | null = null;
export let dbSetupPromise: Promise<void> | null = null;

async function setupDatabase(database: SQL.DatabaseManager) {
	await database.runFile('./databases/schemas/battlestats.sql');
	addPokemon = await database.prepare(
		'INSERT OR IGNORE INTO gen9computergeneratedteams (species_id, wins, losses, level) VALUES (?, 0, 0, ?)'
	);
	incrementWins = await database.prepare(
		'UPDATE gen9computergeneratedteams SET wins = wins + 1 WHERE species_id = ?'
	);
	incrementLosses = await database.prepare(
		'UPDATE gen9computergeneratedteams SET losses = losses + 1 WHERE species_id = ?'
	);
}

if (Config.usesqlite && Config.usesqliteleveling) {
	const database = SQL(module, {
		file: './databases/battlestats.db',
	});
	dbSetupPromise = setupDatabase(database);
}

async function updateStats(battle: RoomBattle, winner: ID) {
	if (!incrementWins || !incrementLosses) await dbSetupPromise;
	if (battle.rated < 1000 || toID(battle.format) !== 'gen9computergeneratedteams') return;

	for (const player of battle.players) {
		const team = await battle.getPlayerTeam(player);
		if (!team) return;
		const increment = (player.id === winner ? incrementWins : incrementLosses);

		for (const species of team) {
			await addPokemon?.run([toID(species.species), species.level]);
			await increment?.run([toID(species.species)]);
		}
	}
}

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		if (!Config.usesqlite || !Config.usesqliteleveling) return;
		void updateStats(battle, winner);
	},
};
