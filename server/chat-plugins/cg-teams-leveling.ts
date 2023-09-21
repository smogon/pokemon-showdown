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

	const p1 = Users.get(battle.p1.name);
	const p2 = Users.get(battle.p2.name);
	if (!p1 || !p2) return;

	const p1team = await battle.getTeam(p1);
	const p2team = await battle.getTeam(p2);
	if (!p1team || !p2team) return;

	let loserTeam, winnerTeam;
	if (winner === p1.id) {
		loserTeam = p2team;
		winnerTeam = p1team;
	} else {
		loserTeam = p1team;
		winnerTeam = p2team;
	}

	for (const species of winnerTeam) {
		await addPokemon?.run([toID(species.species), species.level]);
		await incrementWins?.run([toID(species.species)]);
	}
	for (const species of loserTeam) {
		await addPokemon?.run([toID(species.species), species.level]);
		await incrementLosses?.run([toID(species.species)]);
	}
}

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		if (!Config.usesqlite || !Config.usesqliteleveling) return;
		void updateStats(battle, winner);
	},
};
