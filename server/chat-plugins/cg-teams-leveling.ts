/**
 * Not a chat plugin.
 *
 * Handles updating the level database for [Gen 9] Computer-Generated Teams.
 */

import { SQL, Utils } from "../../lib";
import { getSpeciesName } from "./randombattles/winrates";
import { cgtDatabase } from "../../data/cg-teams";

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

export const commands: Chat.ChatCommands = {
	cgtwr: 'cgtwinrates',
	cgtwinrates(target, room, user) {
		return this.parse(`/j view-cgtwinrates-${target ? 'history--' + target : 'current'}`);
	},
	cgtwinrateshelp: [
		'/cgtwinrates OR /cgtwr - Get a list of the current win rate data for all Pokemon in [Gen 9] Computer Generated Teams.',
	],

	// Add maintenance commands here
};

interface MonCurrent { species_id: ID; wins: number; losses: number; level: number }
interface MonHistory { level: number; species_id: ID; timestamp: number }

export const pages: Chat.PageTable = {
	async cgtwinrates(query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!cgtDatabase) {
			return this.errorReply(`CGT win rates are not being tracked due to the server's SQL settings.`);
		}
		query = query.join('-').split('--');
		const mode = query.shift();
		if (mode === 'current') {
			let buf = `<div class="pad"><h2>Winrates for [Gen 9] Computer Generated Teams</h2>`;
			const sorter = toID(query.shift() || 'alphabetical');
			if (!['alphabetical', 'level'].includes(sorter)) {
				return this.errorReply(`Invalid sorting method. Must be either 'alphabetical' or 'level'.`);
			}
			const otherSort = sorter === 'alphabetical' ? 'Level' : 'Alphabetical';
			buf += `<a class="button" target="replace" href="/view-cgtwinrates-current--${toID(otherSort)}">`;
			buf += `Sort by ${otherSort} descending</a>`;
			buf += `<hr />`;
			const statData: MonCurrent[] = await cgtDatabase.all(
				'SELECT species_id, wins, losses, level FROM gen9computergeneratedteams'
			);
			this.title = `[Winrates] [Gen 9] Computer Generated Teams`;
			let sortFn: (val: MonCurrent) => Utils.Comparable;

			if (sorter === 'alphabetical') {
				sortFn = data => [data.species_id];
			} else {
				sortFn = data => [-data.level];
			}
			const mons = Utils.sortBy(statData, sortFn);
			buf += `<div class="ladder pad"><table><tr><th>Pokemon</th><th>Level</th><th>Wins</th><th>Losses</th>`;
			for (const mon of mons) {
				buf += `<tr><td>${Dex.species.get(mon.species_id).name}</td>`;
				buf += `<td>${mon.level}</td><td>${mon.wins}</td><td>${mon.losses}</td></tr>`;
			}
			buf += `</table></div></div>`;
			return buf;
		} else if (mode === 'history') {
			// Restricted because this is a potentially very slow command
			this.checkCan('modlog', null, Rooms.get('development')!); // stinky non-null assertion

			let speciesID = query.shift();
			let buf;
			if (speciesID) {
				speciesID = getLevelSpeciesID({ species: query.shift() || '' } as PokemonSet);
				const species = Dex.species.get(speciesID);
				if (!species.exists ||
					species.isNonstandard || species.isNonstandard === 'Unobtainable' ||
					species.nfe ||
					species.battleOnly && (!species.requiredItems?.length || species.name.endsWith('-Tera'))
				) {
					this.errorReply('Species has no data in [Gen 9] Computer Generated Teams');
				}
				buf = `<div class="pad"><h2>Level history for ${species.name} in [Gen 9] CGT</h2>`;
			} else {
				buf = `<div class="pad"><h2>Level history for [Gen 9] Computer Generated Teams</h2>`;
			}
			const history: MonHistory[] = await cgtDatabase.all(
				'SELECT level, species_id, timestamp FROM gen9_historical_levels'
			);
			this.title = `[History] [Gen 9] Computer Generated Teams`;

			const MAX_LINES = 100;
			let lines = 0;
			buf += `<div class="ladder pad"><table><tr><th>Pokemon</th><th>Level</th><th>Timestamp</th>`;
			for (const entry of history) {
				if (speciesID && entry.species_id !== speciesID) continue;
				buf += `<tr><td>${entry.species_id}</td><td>${entry.level}</td>`;
				const timestamp = new Date(entry.timestamp);
				buf += `<td>${timestamp.toLocaleDateString()}, ${timestamp.toLocaleTimeString()}</td></tr>`;
				if (++lines >= MAX_LINES) break;
			}
			buf += `</table></div></div>`;
			return buf;
		}
	},
};
