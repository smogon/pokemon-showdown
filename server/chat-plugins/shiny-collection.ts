/**
 * Shiny collection
 *
 * Registered users keep every shiny they roll in random formats (gen 3+, except
 * Super Staff Bros). One collection is shared across all eligible formats: a
 * collected species is forced shiny whenever it appears on that user's random
 * team. See RoomBattle#getCollectedShinies and Battle#getTeam.
 *
 * On by default (Config.shinycollection). Needs the optional dependency
 * better-sqlite3; without it, the feature is off.
 */

import type * as Database from 'better-sqlite3';
import { FS, Utils } from '../../lib';
import { shinyCollectionKey } from '../../sim/battle';

const DB_FILE = 'databases/shinies.db';
/** Battles shorter than this save nothing, so forfeiting on turn 0 can't farm rerolls */
export const MIN_TURNS = 3;
/** Newest shinies shown by /shinies; "/shinies [user], all" shows the rest */
const SHOWN_SHINIES = 30;

interface ShinyRow {
	species: string;
	first_formatid: string;
	obtained_at: number;
}

let db: Database.Database | null = null;
let dbUnavailable = false;
/**
 * Registered users in each battle, captured when their team is created, so a player
 * who is offline when the battle ends still keeps their shinies.
 */
const collectors = new WeakMap<RoomBattle, Set<ID>>();

function getDatabase() {
	if (Config.shinycollection === false) return null;
	if (db || dbUnavailable) return db;
	try {
		const file = Config.nofswriting ? ':memory:' : FS(DB_FILE).path;
		const database: Database.Database = new (require('better-sqlite3'))(file);
		database.exec(`CREATE TABLE IF NOT EXISTS shinies (
			userid TEXT NOT NULL,
			species TEXT NOT NULL,
			first_formatid TEXT NOT NULL,
			obtained_at INTEGER NOT NULL,
			roomid TEXT,
			PRIMARY KEY (userid, species)
		) WITHOUT ROWID`);
		db = database;
	} catch (e: any) {
		dbUnavailable = true;
		Monitor.warn(`Shiny collection disabled: ${e.message}`);
	}
	return db;
}

export function destroy() {
	db?.close();
	db = null;
}

export function isEligibleFormat(formatid: string) {
	const format = Dex.formats.get(formatid);
	if (!format.exists || !format.team?.startsWith('random')) return false;
	// SSB sets pick their own shinies
	if (format.team === 'randomStaffBros') return false;
	// gen 1 has no shinies, and gen 2 shininess depends on DVs, so forcing it would change stats
	return Dex.forFormat(format).gen >= 3;
}

/**
 * Collected species to force shiny on this user's team, or undefined if the
 * collection doesn't apply. Called once per player when the battle starts.
 */
export function getShinies(user: User | null | undefined, battle: RoomBattle): string[] | undefined {
	if (!user?.registered || !isEligibleFormat(battle.format)) return undefined;
	const database = getDatabase();
	if (!database) return undefined;
	let ids = collectors.get(battle);
	if (!ids) collectors.set(battle, ids = new Set());
	ids.add(user.id);
	try {
		const rows = database.prepare(`SELECT species FROM shinies WHERE userid = ?`).all(user.id) as ShinyRow[];
		// species from later gens can't appear, and the list is saved in every input log
		const dex = Dex.forFormat(battle.format);
		const species = rows.map(row => row.species).filter(name => dex.species.get(name).gen <= dex.gen);
		return species.length ? species : undefined;
	} catch (e) {
		Monitor.crashlog(e, 'The shiny collection', { userid: user.id, format: battle.format });
		return undefined;
	}
}

/** Returns the species that were new to the collection */
export function addShinies(userid: ID, species: string[], formatid: ID, roomid: RoomID): string[] {
	const database = getDatabase();
	if (!database) return [];
	const insert = database.prepare(
		`INSERT OR IGNORE INTO shinies (userid, species, first_formatid, obtained_at, roomid) VALUES (?, ?, ?, ?, ?)`
	);
	const added: string[] = [];
	database.transaction(() => {
		for (const name of new Set(species)) {
			if (insert.run(userid, name, formatid, Date.now(), roomid).changes) added.push(name);
		}
	})();
	return added;
}

/** Newest first */
export function listShinies(userid: ID): ShinyRow[] | null {
	const database = getDatabase();
	if (!database) return null;
	return database.prepare(
		`SELECT species, first_formatid, obtained_at FROM shinies WHERE userid = ? ORDER BY obtained_at DESC`
	).all(userid) as ShinyRow[];
}

export function recordShinies(battle: RoomBattle) {
	const logData = battle.logData;
	if (!logData || (logData.turns || 0) < MIN_TURNS || !isEligibleFormat(battle.format)) return;
	const dex = Dex.forFormat(battle.format);
	for (const player of battle.players) {
		// fall back to the live user if the player renamed mid-battle
		if (!collectors.get(battle)?.has(player.id) && !Users.get(player.id)?.registered) continue;
		const team: PokemonSet[] = logData[`${player.slot}team`] || [];
		const found = team.filter(set => set.shiny).map(set => shinyCollectionKey(dex.species.get(set.species), dex));
		if (!found.length) continue;
		const added = addShinies(player.id, found, toID(battle.format), battle.roomid);
		if (!added.length) continue;
		const mons = added.map(name => `<psicon pokemon="${Utils.escapeHTML(name)}" /> ${Utils.escapeHTML(name)}`);
		battle.room.add(
			`|raw|<strong>${Utils.escapeHTML(player.name)}</strong> added shiny ${mons.join(', ')} to their collection!`
		).update();
	}
}

/** Groups shinies under the format each was first found in */
function renderShinies(rows: ShinyRow[]) {
	const byFormat = new Map<string, string[]>();
	for (const row of rows) {
		const mons = byFormat.get(row.first_formatid) || [];
		mons.push(`<psicon pokemon="${Utils.escapeHTML(row.species)}" /> ${Utils.escapeHTML(row.species)}`);
		byFormat.set(row.first_formatid, mons);
	}
	let buf = '';
	for (const [formatid, mons] of byFormat) {
		const format = Dex.formats.get(formatid);
		buf += `<br /><small>${Utils.escapeHTML(format.exists ? format.name : formatid)}:</small> ${mons.join(', ')}`;
	}
	return buf;
}

export const handlers: Chat.Handlers = {
	onBattleEnd(battle) {
		// RoomBattle#end may clear logData right after the handlers run, so this has to stay synchronous.
		// Chat.runHandlers doesn't catch, and a throw here would skip the rest of RoomBattle#end.
		try {
			recordShinies(battle);
		} catch (e) {
			Monitor.crashlog(e, 'The shiny collection', { roomid: battle.roomid });
		}
	},
};

export const commands: Chat.ChatCommands = {
	shinies(target, room, user) {
		const [name, option] = target.split(',').map(part => part.trim());
		const showAll = toID(option) === 'all';
		if (showAll && this.shouldBroadcast()) {
			throw new Chat.ErrorMessage(`The full list can't be broadcast. Use /shinies ${name || user.name}, all instead.`);
		}
		if (!this.runBroadcast()) return;
		const targetid = toID(name) || user.id;
		const displayName = Users.get(targetid)?.name || name || user.name;
		const rows = listShinies(targetid);
		if (!rows) throw new Chat.ErrorMessage(`The shiny collection is not available on this server.`);
		if (!rows.length) {
			if (targetid === user.id && !user.registered) {
				return this.sendReplyBox(`Log in to a registered account to start collecting shinies in random battles.`);
			}
			return this.sendReplyBox(`${Utils.escapeHTML(displayName)} has not collected any shinies yet.`);
		}
		const shown = showAll ? rows : rows.slice(0, SHOWN_SHINIES);
		let buf = `<strong>${Utils.escapeHTML(displayName)}'s shiny collection (${rows.length})</strong>`;
		buf += renderShinies(shown);
		if (shown.length < rows.length) {
			buf += `<br /><small>Showing the newest ${shown.length}. </small>` +
				`<button class="button" name="send" value="/shinies ${Utils.escapeHTML(targetid)}, all">Show all</button>`;
		}
		this.sendReplyBox(buf);
	},
	shinieshelp: [
		`/shinies [user] - Shows the newest shiny Pokémon [user] has collected in random battles. Defaults to you.`,
		`/shinies [user], all - Shows every shiny [user] has collected.`,
		`Shinies you roll in a random format (gen 3 or later, except Super Staff Bros) are saved once the battle reaches turn ${MIN_TURNS}.`,
		`Collected Pokémon are always shiny on your future random teams.`,
		`!shinies [user] - Shows the newest shinies to everyone in the room. Requires: + % @ # ~`,
	],
};
