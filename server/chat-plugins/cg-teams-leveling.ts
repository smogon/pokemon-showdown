/**
 * Not a chat plugin.
 *
 * Handles updating the level database for [Gen 9] Computer-Generated Teams.
 */

import {SQL} from "../../lib";
import {getSpeciesName} from "./randombattles/winrates";

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

function getLevelSpeciesID(set: PokemonSet, format?: Format) {
	if (['Basculin', 'Greninja'].includes(set.name)) return toID(set.species);
	return toID(getSpeciesName(set, format || Dex.formats.get('gen9computergeneratedteams')));
}

async function updateStats(battle: RoomBattle, winner: ID) {
	if (!incrementWins || !incrementLosses) await dbSetupPromise;
	if (toID(battle.format) !== 'gen9computergeneratedteams') return;
	// if the game is rated or part of a tournament hosted by a public room, it counts
	if (battle.rated <= 1 && battle.room.parent?.game) {
		let parent = battle.room.parent;
		if (parent.game!.gameid === 'bestof' && parent.parent?.game) parent = parent.parent;
		if (parent.game!.gameid !== 'tournament' || parent.settings.isPrivate) return;
	} else if (battle.rated < 1000) {
		return;
	}

	for (const player of battle.players) {
		const team = await battle.getPlayerTeam(player);
		if (!team) return;
		const increment = (player.id === winner ? incrementWins : incrementLosses);

		for (const set of team) {
			const statsSpecies = getLevelSpeciesID(set, Dex.formats.get(battle.format));
			await addPokemon?.run([statsSpecies, set.level || 100]);
			await increment?.run([statsSpecies]);
		}
	}
}

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		if (!Config.usesqlite || !Config.usesqliteleveling) return;
		void updateStats(battle, winner);
	},
};
