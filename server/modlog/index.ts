/**
 * Modlog
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Moderator actions are logged into a set of files known as the moderation log, or "modlog."
 * This file handles reading, writing, and querying the modlog.
 *
 * @license MIT
 */

import {SQL, Utils} from '../../lib';
import {Config} from '../config-loader';

// If a modlog query takes longer than this, it will be logged.
const LONG_QUERY_DURATION = 2000;

const MODLOG_SCHEMA_PATH = 'databases/schemas/modlog.sql';
const MODLOG_V2_MIGRATION_PATH = 'databases/migrations/modlog/v2.sql';

export const MODLOG_DB_PATH = Config.nofswriting ? ':memory:' : `${__dirname}/../../databases/modlog.db`;

const GLOBAL_PUNISHMENTS = [
	'WEEKLOCK', 'LOCK', 'BAN', 'RANGEBAN', 'RANGELOCK', 'FORCERENAME',
	'TICKETBAN', 'AUTOLOCK', 'AUTONAMELOCK', 'NAMELOCK', 'AUTOBAN', 'MONTHLOCK',
	'AUTOWEEKLOCK', 'WEEKNAMELOCK', 'FORCEWEEKLOCK', 'FORCELOCK', 'FORCEMONTHLOCK',
	'FORCERENAME OFFLINE',
];

const PUNISHMENTS = [
	...GLOBAL_PUNISHMENTS, 'ROOMBAN', 'WEEKROOMBAN', 'UNROOMBAN', 'WARN', 'MUTE', 'HOURMUTE', 'UNMUTE',
	'CRISISDEMOTE', 'UNLOCK', 'UNLOCKNAME', 'UNLOCKRANGE', 'UNLOCKIP', 'UNBAN',
	'UNRANGEBAN', 'TRUSTUSER', 'UNTRUSTUSER', 'BLACKLIST', 'BATTLEBAN', 'UNBATTLEBAN',
	'NAMEBLACKLIST', 'KICKBATTLE', 'UNTICKETBAN', 'HIDETEXT', 'HIDEALTSTEXT', 'REDIRECT',
	'NOTE', 'MAFIAHOSTBAN', 'MAFIAUNHOSTBAN', 'GIVEAWAYBAN', 'GIVEAWAYUNBAN',
	'TOUR BAN', 'TOUR UNBAN', 'UNNAMELOCK',
];

export type ModlogID = RoomID | 'global' | 'all';
interface SQLQuery {
	query: string;
	args: (string | number)[];
}
interface ModlogResults {
	results: ModlogEntry[];
	duration: number;
}

interface ModlogSQLQuery<T> {
	queryText: string;
	args: T[];
	returnsResults?: boolean;
}

export interface ModlogSearch {
	note: {search: string, isExact?: boolean, isExclusion?: boolean}[];
	user: {search: string, isExact?: boolean, isExclusion?: boolean}[];
	ip: {search: string, isExclusion?: boolean}[];
	action: {search: string, isExclusion?: boolean}[];
	actionTaker: {search: string, isExclusion?: boolean}[];
}

export interface ModlogEntry {
	action: string;
	roomID: string;
	visualRoomID: string;
	userid: ID | null;
	autoconfirmedID: ID | null;
	alts: ID[];
	ip: string | null;
	isGlobal: boolean;
	loggedBy: ID | null;
	note: string;
	/** Milliseconds since the epoch */
	time: number;
}

export interface TransactionArguments extends Record<string, unknown> {
	entries: Iterable<ModlogEntry>;
	modlogInsertionStatement: string;
	altsInsertionStatement: string;
}

export type PartialModlogEntry = Partial<ModlogEntry> & {action: string};

export class Modlog {
	readonly database: SQL.DatabaseManager;
	readyPromise: Promise<void> | null;
	private databaseReady: boolean;
	/** entries to be written once the DB is ready */
	queuedEntries: ModlogEntry[];

	modlogInsertionQuery: SQL.Statement | null = null;
	altsInsertionQuery: SQL.Statement | null = null;
	renameQuery: SQL.Statement | null = null;
	globalPunishmentsSearchQuery: SQL.Statement | null = null;

	constructor(databasePath: string, options: Partial<SQL.Options>) {
		this.queuedEntries = [];
		this.databaseReady = false;
		if (!options.onError) {
			options.onError = (error, data, isParent) => {
				if (!isParent) return;
				Monitor.crashlog(error, 'A modlog SQLite query', {
					query: JSON.stringify(data),
				});
			};
		}
		this.database = SQL(module, {
			file: databasePath,
			extension: 'server/modlog/transactions.ts',
			...options,
		});

		if (Config.usesqlite) {
			if (this.database.isParentProcess) {
				this.database.spawn(Config.modlogprocesses || 1);
			} else {
				global.Monitor = {
					crashlog(error: Error, source = 'A modlog child process', details: AnyObject | null = null) {
						const repr = JSON.stringify([error.name, error.message, source, details]);
						process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
					},
				};
				process.on('uncaughtException', err => {
					Monitor.crashlog(err, 'A modlog database process');
				});
				process.on('unhandledRejection', err => {
					Monitor.crashlog(err as Error, 'A modlog database process');
				});
			}
		}

		this.readyPromise = this.setupDatabase().then(result => {
			this.databaseReady = result;
			this.readyPromise = null;
		});
	}

	async setupDatabase() {
		if (!Config.usesqlite) return false;
		await this.database.exec("PRAGMA foreign_keys = ON;");
		await this.database.exec(`PRAGMA case_sensitive_like = true;`);

		// Set up tables, etc
		const dbExists = await this.database.get(`SELECT * FROM sqlite_master WHERE name = 'modlog'`);
		if (!dbExists) {
			await this.database.runFile(MODLOG_SCHEMA_PATH);
		}

		const {hasDBInfo} = await this.database.get(
			`SELECT count(*) AS hasDBInfo FROM sqlite_master WHERE type = 'table' AND name = 'db_info'`
		);

		if (hasDBInfo === 0) {
			// needs v2 migration
			const warnFunction = ('Monitor' in global && Monitor.warn) ? Monitor.warn : console.log;
			warnFunction(`The modlog database is being migrated to version 2; this may take a while.`);
			await this.database.runFile(MODLOG_V2_MIGRATION_PATH);
			warnFunction(`Modlog database migration complete.`);
		}

		this.modlogInsertionQuery = await this.database.prepare(
			`INSERT INTO modlog (timestamp, roomid, visual_roomid, action, userid, autoconfirmed_userid, ip, action_taker_userid, is_global, note)` +
			` VALUES ($time, $roomID, $visualRoomID, $action, $userid, $autoconfirmedID, $ip, $loggedBy, $isGlobal, $note)`
		);
		this.altsInsertionQuery = await this.database.prepare(`INSERT INTO alts (modlog_id, userid) VALUES (?, ?)`);
		this.renameQuery = await this.database.prepare(`UPDATE modlog SET roomid = ? WHERE roomid = ?`);
		this.globalPunishmentsSearchQuery = await this.database.prepare(
			`SELECT * FROM modlog WHERE is_global = 1 ` +
			`AND (userid = ? OR autoconfirmed_userid = ? OR EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND userid = ?)) ` +
			`AND timestamp > ? ` +
			`AND action IN (${Utils.formatSQLArray(GLOBAL_PUNISHMENTS, [])})`
		);
		await this.writeSQL(this.queuedEntries);
		return true;
	}

	/******************
	 * Helper methods *
	 ******************/
	getSharedID(roomid: ModlogID): ID | false {
		return roomid.includes('-') ? `${toID(roomid.split('-')[0])}-rooms` as ID : false;
	}

	/**************************************
	 * Methods for writing to the modlog. *
	 **************************************/

	/**
	 * @deprecated Modlogs use SQLite and no longer need initialization.
	 */
	initialize(roomid: ModlogID) {
		return;
	}


	/**
	 * Writes to the modlog
	 */
	async write(roomid: string, entry: PartialModlogEntry, overrideID?: string) {
		if (!Config.usesqlite || !Config.usesqlitemodlog) return;
		const roomID = entry.roomID || roomid;
		const insertableEntry: ModlogEntry = {
			action: entry.action,
			roomID,
			visualRoomID: overrideID || entry.visualRoomID || '',
			userid: entry.userid || null,
			autoconfirmedID: entry.autoconfirmedID || null,
			alts: entry.alts ? [...new Set(entry.alts)] : [],
			ip: entry.ip || null,
			isGlobal: entry.isGlobal || roomID === 'global' || false,
			loggedBy: entry.loggedBy || null,
			note: entry.note || '',
			time: entry.time || Date.now(),
		};

		await this.writeSQL([insertableEntry]);
	}

	async writeSQL(entries: Iterable<ModlogEntry>) {
		if (!Config.usesqlite) return;
		if (!this.databaseReady) {
			this.queuedEntries.push(...entries);
			return;
		}
		const toInsert: TransactionArguments = {
			entries,
			modlogInsertionStatement: this.modlogInsertionQuery!.toString(),
			altsInsertionStatement: this.altsInsertionQuery!.toString(),
		};
		await this.database.transaction('insertion', toInsert);
	}

	/**
	 * @deprecated Modlogs use SQLite and no longer need to be destroyed
	 */
	async destroy(roomid: ModlogID) {
		return Promise.resolve(undefined);
	}

	destroyAllSQLite() {
		if (!this.database) return;
		void this.database.destroy();
		this.databaseReady = false;
	}

	destroyAll() {
		this.destroyAllSQLite();
	}

	async rename(oldID: ModlogID, newID: ModlogID) {
		if (!Config.usesqlite) return;
		if (oldID === newID) return;

		// rename SQL modlogs
		if (this.readyPromise) await this.readyPromise;
		if (this.databaseReady) {
			await this.database.run(this.renameQuery!, [newID, oldID]);
		} else {
			// shouldn't happen since we await the ready promise and check that useslite is on
			// but will still happen if usesqlite is enabled without a subsequent hotpatch
			throw new Error(`Attempted to rename a room's modlog before the SQL database was ready.`);
		}
	}

	/******************************************
	 * Methods for reading (searching) modlog *
	 ******************************************/
	async getGlobalPunishments(user: User | string, days = 30) {
		if (!Config.usesqlite || !Config.usesqlitemodlog) return null;
		return this.getGlobalPunishmentsSQL(toID(user), days);
	}

	async getGlobalPunishmentsSQL(userid: ID, days: number) {
		if (this.readyPromise) await this.readyPromise;

		if (!this.globalPunishmentsSearchQuery) {
			throw new Error(`Modlog#globalPunishmentsSearchQuery is falsy but an SQL search function was called.`);
		}
		const args: (string | number)[] = [
			userid, userid, userid, Date.now() - (days * 24 * 60 * 60 * 1000), ...GLOBAL_PUNISHMENTS,
		];
		const results = await this.database.all(this.globalPunishmentsSearchQuery, args);
		return results.length;
	}

	/**
	 * Searches the modlog.
	 *
	 * @returns Either a promise for ModlogResults or `null` if modlog is disabled.
	 */
	async search(
		roomid: ModlogID = 'global',
		search: ModlogSearch = {note: [], user: [], ip: [], action: [], actionTaker: []},
		maxLines = 20,
		onlyPunishments = false,
	): Promise<ModlogResults | null> {
		if (!Config.usesqlite || !Config.usesqlitemodlog) return null;
		const startTime = Date.now();

		let rooms: ModlogID[] | 'all';
		if (roomid === 'public') {
			rooms = [...Rooms.rooms.values()]
				.filter(room => !room.settings.isPrivate && !room.settings.isPersonal)
				.map(room => room.roomid);
		} else if (roomid === 'all') {
			rooms = 'all';
		} else {
			rooms = [roomid];
		}

		if (this.readyPromise) await this.readyPromise;
		if (!this.databaseReady) return null;
		const query = this.prepareSQLSearch(rooms, maxLines, onlyPunishments, search);
		const results = (await this.database.all(query.queryText, query.args))
			.map((row: any) => this.dbRowToModlogEntry(row));

		const duration = Date.now() - startTime;
		if (duration > LONG_QUERY_DURATION) {
			Monitor.slow(`[slow SQL modlog search] ${duration}ms - ${JSON.stringify(query)}`);
		}
		return {results, duration};
	}

	dbRowToModlogEntry(row: any): ModlogEntry {
		return {
			action: row.action,
			roomID: row.roomid,
			visualRoomID: row.visual_roomid,
			userid: row.userid,
			autoconfirmedID: row.autoconfirmed_userid,
			alts: row.alts?.split(',') || [],
			ip: row.ip || null,
			isGlobal: Boolean(row.is_global),
			loggedBy: row.action_taker_userid,
			note: row.note,
			time: row.timestamp,
		};
	}

	/**
	 * This is a helper method to build SQL queries optimized to better utilize indices.
	 * This was discussed in https://psim.us/devdiscord (although the syntax is slightly different in practice):
	 * https://discord.com/channels/630837856075513856/630845310033330206/766736895132303371
	 *
	 * @param select A query fragment of the form `SELECT ... FROM ...`
	 * @param ors Each OR condition fragment (e.g. `userid = ?`)
	 * @param ands Each AND conditions to be appended to every OR condition (e.g. `roomid = ?`)
	 * @param sortAndLimit A fragment of the form `ORDER BY ... LIMIT ...`
	 */
	buildParallelIndexScanQuery(
		select: string,
		ors: SQLQuery[],
		ands: SQLQuery[],
		sortAndLimit: SQLQuery
	): ModlogSQLQuery<string | number> {
		if (!this.database) throw new Error(`Parallel index scan queries cannot be built when SQLite is not enabled.`);
		// assemble AND fragment
		let andQuery = ``;
		const andArgs = [];
		for (const and of ands) {
			if (andQuery.length) andQuery += ` AND `;
			andQuery += and.query;
			andArgs.push(...and.args);
		}

		// assemble query
		let query = ``;
		const args = [];
		if (!ors.length) {
			query = `${select} ${andQuery ? ` WHERE ${andQuery}` : ``}`;
			args.push(...andArgs);
		} else {
			for (const or of ors) {
				if (query.length) query += ` UNION `;
				query += `SELECT * FROM (${select} WHERE ${or.query} ${andQuery ? ` AND ${andQuery}` : ``} ${sortAndLimit.query})`;
				args.push(...or.args, ...andArgs, ...sortAndLimit.args);
			}
		}
		query += ` ${sortAndLimit.query}`;
		args.push(...sortAndLimit.args);

		return {
			queryText: query,
			args,
		};
	}

	prepareSQLSearch(
		rooms: ModlogID[] | 'all',
		maxLines: number,
		onlyPunishments: boolean,
		search: ModlogSearch
	): ModlogSQLQuery<string | number> {
		const select = `SELECT *, (SELECT group_concat(userid, ',') FROM alts WHERE alts.modlog_id = modlog.modlog_id) as alts FROM modlog`;
		const ors = [];
		const ands = [];
		const sortAndLimit = {query: `ORDER BY timestamp DESC`, args: []} as SQLQuery;
		if (maxLines) {
			sortAndLimit.query += ` LIMIT ?`;
			sortAndLimit.args.push(maxLines);
		}

		// Limit the query to only the specified rooms, treating "global" as a pseudo-room that checks is_global
		// (This is because the text modlog system gave global modlog entries their own file, as a room would have.)
		if (rooms !== 'all') {
			const args: (string | number)[] = [];
			let roomChecker = `roomid IN (${Utils.formatSQLArray(rooms, args)})`;
			if (rooms.includes('global')) {
				if (rooms.length > 1) {
					roomChecker = `(is_global = 1 OR ${roomChecker})`;
				} else {
					roomChecker = `is_global = 1`;
					// remove the room argument added by the initial roomChecker assignment
					args.pop();
				}
			}
			ands.push({query: roomChecker, args});
		}

		for (const action of search.action) {
			const args = [action.search + '%'];
			if (action.isExclusion) {
				ands.push({query: `action NOT LIKE ?`, args});
			} else {
				ands.push({query: `action LIKE ?`, args});
			}
		}
		if (onlyPunishments) {
			const args: (string | number)[] = [];
			ands.push({query: `action IN (${Utils.formatSQLArray(PUNISHMENTS, args)})`, args});
		}

		for (const ip of search.ip) {
			const args = [ip.search + '%'];
			if (ip.isExclusion) {
				ands.push({query: `ip NOT LIKE ?`, args});
			} else {
				ands.push({query: `ip LIKE ?`, args});
			}
		}
		for (const actionTaker of search.actionTaker) {
			const args = [actionTaker.search + '%'];
			if (actionTaker.isExclusion) {
				ands.push({query: `action_taker_userid NOT LIKE ?`, args});
			} else {
				ands.push({query: `action_taker_userid LIKE ?`, args});
			}
		}

		for (const noteSearch of search.note) {
			const tester = noteSearch.isExact ? `= ?` : `LIKE ?`;
			const args = [noteSearch.isExact ? noteSearch.search : `%${noteSearch.search}%`];
			if (noteSearch.isExclusion) {
				ands.push({query: `note ${noteSearch.isExact ? '!' : 'NOT '}${tester}`, args});
			} else {
				ands.push({query: `note ${tester}`, args});
			}
		}

		for (const user of search.user) {
			let tester;
			let param;
			if (user.isExact) {
				tester = user.isExclusion ? `!= ?` : `= ?`;
				param = user.search.toLowerCase();
			} else {
				tester = user.isExclusion ? `NOT LIKE ?` : `LIKE ?`;
				param = user.search.toLowerCase() + '%';
			}

			ors.push({query: `(userid ${tester} OR autoconfirmed_userid ${tester})`, args: [param, param]});
			ors.push({
				query: `EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND alts.userid ${tester})`,
				args: [param],
			});
		}
		return this.buildParallelIndexScanQuery(select, ors, ands, sortAndLimit);
	}
}

export const mainModlog = new Modlog(MODLOG_DB_PATH, {sqliteOptions: Config.modlogsqliteoptions});
