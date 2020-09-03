/**
 * Modlog
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Moderator actions are logged into a set of files known as the moderation log, or "modlog."
 * This file handles reading, writing, and querying the modlog.
 *
 * @license MIT
 */


import {FS} from '../lib/fs';
import {QueryProcessManager} from '../lib/process-manager';
import {Repl} from '../lib/repl';
import * as Database from 'better-sqlite3';

const MAX_PROCESSES = 1;
// If a modlog query takes longer than this, it will be logged.
const LONG_QUERY_DURATION = 2000;
const MODLOG_DB_PATH = `${__dirname}/../databases/modlog.db`;
const MODLOG_SCHEMA_PATH = 'databases/schemas/modlog.sql';

const GLOBAL_PUNISHMENTS = [
	'WEEKLOCK', 'LOCK', 'BAN', 'RANGEBAN', 'RANGELOCK', 'FORCERENAME',
	'TICKETBAN', 'AUTOLOCK', 'AUTONAMELOCK', 'NAMELOCK', 'AUTOBAN', 'MONTHLOCK',
];
const PUNISHMENTS = [
	...GLOBAL_PUNISHMENTS, 'ROOMBAN', 'UNROOMBAN', 'WARN', 'MUTE', 'HOURMUTE', 'UNMUTE',
	'CRISISDEMOTE', 'UNLOCK', 'UNLOCKNAME', 'UNLOCKRANGE', 'UNLOCKIP', 'UNBAN',
	'UNRANGEBAN', 'TRUSTUSER', 'UNTRUSTUSER', 'BLACKLIST', 'BATTLEBAN', 'UNBATTLEBAN',
	'NAMEBLACKLIST', 'KICKBATTLE', 'UNTICKETBAN', 'HIDETEXT', 'HIDEALTSTEXT', 'REDIRECT',
	'NOTE', 'MAFIAHOSTBAN', 'MAFIAUNHOSTBAN', 'GIVEAWAYBAN', 'GIVEAWAYUNBAN',
	'TOUR BAN', 'TOUR UNBAN', 'UNNAMELOCK',
];

export type ModlogID = RoomID | 'global';

interface ModlogResults {
	results: ModlogEntry[];
	duration?: number;
}

interface ModlogQuery<T> {
	statement: Database.Statement<T>;
	args: T[];
}

export interface ModlogSearch {
	note?: {searches: string[], isExact?: boolean};
	user?: string;
	ip?: string;
	action?: string;
	actionTaker?: string;
}

export interface ModlogEntry {
	action: string;
	roomID?: string;
	visualRoomID?: string;
	userid?: ID;
	autoconfirmedID?: ID;
	alts?: ID[];
	ip?: string;
	isGlobal?: boolean;
	loggedBy?: ID;
	note?: string;
	/** Milliseconds since the epoch */
	time?: number;
}

export class Modlog {
	readonly database: Database.Database;
	readonly usePM: boolean;
	readonly modlogInsertionQuery: Database.Statement<ModlogEntry>;
	readonly altsInsertionQuery: Database.Statement<[number, string]>;
	readonly renameQuery: Database.Statement<[string, string]>;
	readonly globalPunishmentsSearchQuery: Database.Statement<[string, string, string, number, ...string[]]>;
	readonly insertionTransaction: Database.Transaction;

	constructor(path: string, noProcessManager = false) {
		this.database = new Database(path);
		this.database.exec("PRAGMA foreign_keys = ON;");
		this.database.exec(FS(MODLOG_SCHEMA_PATH).readIfExistsSync()); // Set up tables, etc.
		this.database.function('regex', {deterministic: true}, (regexString, toMatch) => {
			return Number(RegExp(regexString).test(toMatch));
		});

		this.modlogInsertionQuery = this.database.prepare(
			`INSERT INTO modlog (timestamp, roomid, visual_roomid, action, userid, autoconfirmed_userid, ip, action_taker_userid, note)` +
			` VALUES ($time, $roomID, $visualRoomID, $action, $userid, $autoconfirmedID, $ip, $loggedBy, $note)`
		);
		this.altsInsertionQuery = this.database.prepare(`INSERT INTO alts (modlog_id, userid) VALUES (?, ?)`);
		this.renameQuery = this.database.prepare(`UPDATE modlog SET roomid = ? WHERE roomid = ?`);
		this.globalPunishmentsSearchQuery = this.database.prepare(
			`SELECT * FROM modlog WHERE (roomid = 'global' OR roomid LIKE 'global-%') ` +
			`AND (userid = ? OR autoconfirmed_userid = ? OR EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND userid = ?)) ` +
			`AND timestamp > ?` +
			`AND action IN (${this.formatArray(GLOBAL_PUNISHMENTS, [])}) `
		);

		this.insertionTransaction = this.database.transaction((entry: {
			action: string,
			roomID: string,
			visualRoomID: string,
			userid: ID,
			autoconfirmedID: ID,
			ip: string,
			loggedBy: ID,
			note: string,
			time: number,
			alts: ID[],
		}) => {
			const result = this.modlogInsertionQuery.run(entry);
			for (const alt of entry.alts || []) {
				this.altsInsertionQuery.run(result.lastInsertRowid as number, alt);
			}
		});
		this.usePM = !noProcessManager && !Config.nofswriting;
	}

	async runSQL(query: ModlogQuery<any>, forceNoPM = false): Promise<Database.RunResult> {
		if (!forceNoPM && this.usePM) {
			return PM.query({query, returnsResults: false});
		} else {
			return query.statement.run(query.args);
		}
	}

	async runSQLWithResults(query: ModlogQuery<any>, forceNoPM = false): Promise<unknown[]> {
		if (!forceNoPM && this.usePM) {
			return PM.query({query, returnsResults: true});
		} else {
			return query.statement.all(query.args);
		}
	}

	/**
	 * Writes to the modlog
	 */
	write(roomid: string, entry: ModlogEntry, overrideID?: string) {
		roomid = entry.roomID || roomid;
		if (entry.isGlobal && roomid !== 'global' && !roomid.startsWith('global-')) roomid = `global-${roomid}`;
		this.insertionTransaction({
			action: entry.action,
			roomID: roomid,
			visualRoomID: overrideID || entry.visualRoomID,
			userid: entry.userid,
			autoconfirmedID: entry.autoconfirmedID,
			ip: entry.ip,
			loggedBy: entry.loggedBy,
			note: entry.note,
			time: entry.time || Date.now(),
			alts: entry.alts,
		});
	}

	rename(oldID: ModlogID, newID: ModlogID) {
		if (oldID === newID) return;
		void this.runSQL({statement: this.renameQuery, args: [newID, oldID]});
	}

	/******************************************
	 * Methods for reading (searching) modlog *
	 ******************************************/
	generateRegex(search: string, isExact?: boolean) {
		// Ensure the generated regex can never be greater than or equal to the value of
		// RegExpMacroAssembler::kMaxRegister in v8 (currently 1 << 16 - 1) given a
		// search with max length MAX_QUERY_LENGTH. Otherwise, the modlog
		// child process will crash when attempting to execute any RegExp
		// constructed with it (i.e. when not configured to use ripgrep).
		if (isExact) return search.replace(/[\\.+*?()|[\]{}^$]/g, '\\$&');
		return `[^a-zA-Z0-9]?${[...search].join('[^a-zA-Z0-9]*')}([^a-zA-Z0-9]|\\z)`;
	}

	formatArray(arr: unknown[], args: unknown[]) {
		args.push(...arr);
		return [...'?'.repeat(arr.length)].join(', ');
	}

	prepareSearch(
		rooms: ModlogID[], maxLines: number, onlyPunishments: boolean, search: ModlogSearch
	): ModlogQuery<string | number> {
		for (const room of [...rooms]) {
			rooms.push(`global-${room}` as ModlogID);
		}
		const userid = toID(search.user);

		const args: (string | number)[] = [];

		let roomChecker = `roomid IN (${this.formatArray(rooms, args)})`;
		if (rooms.includes('global')) roomChecker = `(roomid LIKE 'global-%' OR ${roomChecker})`;

		let query = `SELECT *, (SELECT group_concat(userid, ',') FROM alts WHERE alts.modlog_id = modlog.modlog_id) as alts FROM modlog`;
		query += ` WHERE ${roomChecker}`;

		if (search.action) {
			query += ` AND action LIKE '%' || ? || '%'`;
			args.push(search.action.toUpperCase());
		} else if (onlyPunishments) {
			query += ` AND action IN (${this.formatArray(PUNISHMENTS, args)})`;
		}

		if (userid) {
			const regex = this.generateRegex(userid, true);
			query += ` AND (regex(?, userid) OR regex(?, autoconfirmed_userid) OR EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND regex(?, userid)))`;
			args.push(regex, regex, regex);
		}

		if (search.ip) {
			query += ` AND regex(?, ip)`;
			args.push(this.generateRegex(search.ip, true));
		}

		if (search.actionTaker) {
			query += ` AND regex(?, action_taker_userid)`;
			args.push(this.generateRegex(search.actionTaker, true));
		}

		if (search.note) {
			if (search.note.searches.length === 1) {
				query += ` AND regex(?, note)`;
				args.push(this.generateRegex(search.note.searches[0], search.note.isExact));
			} else {
				const parts = [];
				for (const noteSearch of search.note.searches) {
					parts.push(`regex(?, note)`);
					args.push(this.generateRegex(noteSearch, search.note.isExact));
				}
				query += ` AND (${parts.join(' OR ')})`;
			}
		}

		query += ` ORDER BY timestamp DESC`;
		if (maxLines) {
			query += ` LIMIT ?`;
			args.push(maxLines);
		}
		return {statement: this.database.prepare(query), args};
	}

	async getGlobalPunishments(user: User | string, days = 30) {
		const userid = toID(user);
		const args: (string | number)[] = [
			userid, userid, userid, (Date.now() / 1000) - (days * 24 * 60 * 60), ...GLOBAL_PUNISHMENTS,
		];
		const results = await this.runSQLWithResults({statement: this.globalPunishmentsSearchQuery, args});
		return results.length;
	}

	async search(
		roomid: ModlogID = 'global',
		search: ModlogSearch = {},
		maxLines = 20,
		onlyPunishments = false
	): Promise<ModlogResults> {
		const rooms = (roomid === 'public' || roomid === 'all' ?
			[...Rooms.rooms.values(), {roomid: 'global', settings: {isPrivate: false, isPersonal: false}}]
				.filter(room => {
					if (roomid === 'all') return true;
					return !room.settings.isPrivate && !room.settings.isPersonal;
				})
				.map(room => room.roomid as ModlogID) :
			[roomid]
		);

		const query = this.prepareSearch(rooms, maxLines, onlyPunishments, search);
		const start = Date.now();
		const rows = await this.runSQLWithResults(query);
		const results: ModlogEntry[] = rows.map((row: any) => {
			return {
				action: row.action,
				roomID: row.roomid?.replace(/^global-/, ''),
				visualRoomID: row.visual_roomid,
				userid: row.userid,
				autoconfirmedID: row.autoconfirmed_userid,
				alts: row.alts?.split(','),
				ip: row.ip,
				isGlobal: row.roomid?.startsWith('global-'),
				loggedBy: row.action_taker_userid,
				note: row.note,
				time: row.timestamp,
			};
		}).filter((entry: ModlogEntry) => entry.action);
		const duration = Date.now() - start;

		if (duration > LONG_QUERY_DURATION) {
			Monitor.log(`Long modlog query took ${duration} ms to complete: ${query.statement.source}`);
		}
		return {results, duration};
	}
}

// eslint-disable-next-line max-len
export const PM = new QueryProcessManager<{query: ModlogQuery<string | number>, returnsResults: boolean}, unknown[] | Database.RunResult | undefined>(
	module,
	data => {
		const {query, returnsResults} = data;
		try {
			if (returnsResults) return modlog.runSQLWithResults(query, true);
			return modlog.runSQL(query, true);
		} catch (err) {
			Monitor.crashlog(err, 'A modlog query', data);
		}
	}
);
if (!PM.isParentProcess) {
	global.Config = require('./config-loader').Config;

	// @ts-ignore ???
	global.Monitor = {
		crashlog(error: Error, source = 'A modlog process', details: {} | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			// @ts-ignore please be silent
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};

	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A modlog child process');
		}
	});

	// eslint-disable-next-line no-eval
	Repl.start('modlog', cmd => eval(cmd));
} else {
	PM.spawn(MAX_PROCESSES);
}

export const modlog = new Modlog(MODLOG_DB_PATH);
