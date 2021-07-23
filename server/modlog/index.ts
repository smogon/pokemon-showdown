/**
 * Modlog
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Moderator actions are logged into a set of files known as the moderation log, or "modlog."
 * This file handles reading, writing, and querying the modlog.
 *
 * @license MIT
 */

import {FS, SQL} from '../../lib';
import type {DatabaseWrapper, SQLOptions} from '../../lib/sql';

// If a modlog query takes longer than this, it will be logged.
const LONG_QUERY_DURATION = 2000;

const MODLOG_SCHEMA_PATH = 'databases/schemas/modlog.sql';
const MODLOG_V2_MIGRATION_PATH = 'databases/migrations/modlog/v2.sql';

export const MODLOG_PATH = 'logs/modlog';
export const MODLOG_DB_PATH = Config.nofswriting ? ':memory:' : `${__dirname}/../../databases/modlog.db`;

const GLOBAL_PUNISHMENTS = [
	'WEEKLOCK', 'LOCK', 'BAN', 'RANGEBAN', 'RANGELOCK', 'FORCERENAME',
	'TICKETBAN', 'AUTOLOCK', 'AUTONAMELOCK', 'NAMELOCK', 'AUTOBAN', 'MONTHLOCK',
	'AUTOWEEKLOCK', 'WEEKNAMELOCK',
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
	statement: number;
	queryText: string;
	args: T[];
	returnsResults?: boolean;
}

export interface ModlogSearch {
	note?: {searches: string[], isExact?: boolean};
	user?: {search: string, isExact?: boolean};
	anyField?: string;
	ip?: string;
	action?: string;
	actionTaker?: string;
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
	modlogInsertionStatement: number;
	altsInsertionStatement: number;
}

export type PartialModlogEntry = Partial<ModlogEntry> & {action: string};

export class Modlog {
	readonly logPath: string;
	/**
	 * If a room ID is not in the Map, that means the room's modlog stream
	 * has not yet been initialized, or was previously destroyed.
	 * If a room ID is in the Map, its modlog stream is open and ready to be written to.
	 */
	sharedStreams = new Map<ID, Streams.WriteStream>();
	streams = new Map<ModlogID, Streams.WriteStream>();

	readonly database?: DatabaseWrapper;

	readyPromise: Promise<void> | null;
	private databaseReady: boolean;
	/** entries to be written once the DB is ready */
	queuedEntries: ModlogEntry[];

	modlogInsertionQuery?: number;
	altsInsertionQuery?: number;
	renameQuery?: number;
	globalPunishmentsSearchQuery?: number;


	constructor(flatFilePath: string, databasePath: string, sqliteOptions?: Partial<SQLOptions>) {
		this.logPath = flatFilePath;
		this.queuedEntries = [];
		this.databaseReady = false;

		if (Config.usesqlite) {
			const dbExists = FS(databasePath).existsSync();
			this.database = SQL({
				file: databasePath,
				extension: 'server/modlog/transactions.ts',
				...sqliteOptions,
			});

			// we can't prepare statements or block on database queries, since constructors must be synchronous
			this.readyPromise = this.setupDatabase(dbExists).then(() => {
				this.databaseReady = true;
				this.readyPromise = null;
			});
		} else {
			this.readyPromise = new Promise(resolve => {
				this.readyPromise = null;
				resolve();
			});
		}
	}

	async setupDatabase(dbExists: boolean) {
		if (!this.database) return;

		await this.database.exec("PRAGMA foreign_keys = ON;");
		await this.database.exec(`PRAGMA case_sensitive_like = true;`);

		// Set up tables, etc
		if (!dbExists) {
			await this.database.runFile(MODLOG_SCHEMA_PATH);
		}

		const statement = await this.database.prepare(
			`SELECT count(*) AS hasDBInfo FROM sqlite_master WHERE type = 'table' AND name = 'db_info'`
		);
		const {hasDBInfo} = await this.database.get(statement);

		if (hasDBInfo === 0) {
			// needs v2 migration
			Monitor.warn(`The modlog database is being migrated to version 2; this may take a while.`);
			await this.database.runFile(MODLOG_V2_MIGRATION_PATH);
			Monitor.warn(`Modlog database migration complete.`);
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
			`AND action IN (${Modlog.formatArray(GLOBAL_PUNISHMENTS, [])})`
		);
		await this.writeSQL(this.queuedEntries);
	}

	/******************
	 * Helper methods *
	 ******************/
	static formatArray(arr: unknown[], args: unknown[]) {
		args.push(...arr);
		return [...'?'.repeat(arr.length)].join(', ');
	}

	getSharedID(roomid: ModlogID): ID | false {
		return roomid.includes('-') ? `${toID(roomid.split('-')[0])}-rooms` as ID : false;
	}

	/**************************************
	 * Methods for writing to the modlog. *
	 **************************************/
	initialize(roomid: ModlogID) {
		if (this.streams.get(roomid)) return;
		const sharedStreamId = this.getSharedID(roomid);
		if (!sharedStreamId) {
			return this.streams.set(roomid, FS(`${this.logPath}/modlog_${roomid}.txt`).createAppendStream());
		}

		let stream = this.sharedStreams.get(sharedStreamId);
		if (!stream) {
			const path = `${this.logPath}/modlog_${sharedStreamId}.txt`;
			stream = FS(path).createAppendStream();
			if (!stream) throw new Error(`Could not create append stream for ${path}.`);
			this.sharedStreams.set(sharedStreamId, stream);
		}
		this.streams.set(roomid, stream);
	}

	/**
	 * Writes to the modlog
	 */
	async write(roomid: string, entry: PartialModlogEntry, overrideID?: string) {
		const insertableEntry: ModlogEntry = {
			action: entry.action,
			roomID: entry.roomID || roomid,
			visualRoomID: overrideID || entry.visualRoomID || '',
			userid: entry.userid || null,
			autoconfirmedID: entry.autoconfirmedID || null,
			alts: entry.alts ? [...new Set(entry.alts)] : [],
			ip: entry.ip || null,
			isGlobal: entry.isGlobal || false,
			loggedBy: entry.loggedBy || null,
			note: entry.note || '',
			time: entry.time || Date.now(),
		};

		// this.writeText([insertableEntry]);
		if (Config.usesqlitemodlog) {
			await this.writeSQL([insertableEntry]);
		}
	}

	async writeSQL(entries: Iterable<ModlogEntry>) {
		if (!Config.usesqlite) return;
		if (!this.databaseReady) {
			this.queuedEntries.push(...entries);
			return;
		}
		const toInsert: TransactionArguments = {
			entries,
			modlogInsertionStatement: this.modlogInsertionQuery!,
			altsInsertionStatement: this.altsInsertionQuery!,
		};
		await this.database!.transaction('insertion', toInsert);
	}

	writeText(entries: Iterable<ModlogEntry>) {
		const buffers = new Map<ModlogID, string>();
		for (const entry of entries) {
			const streamID = entry.roomID as ModlogID;

			let entryText = `[${new Date(entry.time).toJSON()}] (${entry.visualRoomID || entry.roomID}) ${entry.action}:`;
			if (entry.userid) entryText += ` [${entry.userid}]`;
			if (entry.autoconfirmedID) entryText += ` ac:[${entry.autoconfirmedID}]`;
			if (entry.alts.length) entryText += ` alts:[${entry.alts.join('], [')}]`;
			if (entry.ip) entryText += ` [${entry.ip}]`;
			if (entry.loggedBy) entryText += ` by ${entry.loggedBy}`;
			if (entry.note) entryText += `: ${entry.note}`;
			entryText += `\n`;

			buffers.set(streamID, (buffers.get(streamID) || '') + entryText);
			if (entry.isGlobal && streamID !== 'global') {
				buffers.set('global', (buffers.get('global') || '') + entryText);
			}
		}

		for (const [streamID, buffer] of buffers) {
			const stream = this.streams.get(streamID);
			if (!stream) throw new Error(`Attempted to write to an uninitialized modlog stream for the room '${streamID}'`);
			void stream.write(buffer);
		}
	}

	async destroy(roomid: ModlogID) {
		const stream = this.streams.get(roomid);
		if (stream && !this.getSharedID(roomid)) {
			await stream.writeEnd();
		}
		this.streams.delete(roomid);
	}

	async destroyAllText() {
		const promises = [];
		for (const id in this.streams) {
			promises.push(this.destroy(id as ModlogID));
		}
		return Promise.all(promises);
	}

	destroyAllSQLite() {
		if (!this.database) return;
		this.database.destroy();
		this.databaseReady = false;
	}

	async destroyAll() {
		this.destroyAllSQLite();
		await this.destroyAllText();
	}

	async rename(oldID: ModlogID, newID: ModlogID) {
		if (oldID === newID) return;

		// rename flat-file modlogs
		const streamExists = this.streams.has(oldID);
		if (streamExists) await this.destroy(oldID);
		if (!this.getSharedID(oldID)) {
			await FS(`${this.logPath}/modlog_${oldID}.txt`).rename(`${this.logPath}/modlog_${newID}.txt`);
		}
		if (streamExists) this.initialize(newID);

		// rename SQL modlogs
		if (Config.usesqlite) {
			if (this.databaseReady) {
				await this.database!.run(this.renameQuery!, [newID, oldID]);
			} else {
				throw new Error(`Attempted to rename a room's modlog before the SQL database was ready.`);
			}
		}
	}

	getActiveStreamIDs() {
		return [...this.streams.keys()];
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
		const results = await this.database!.all(this.globalPunishmentsSearchQuery, args);
		return results.length;
	}

	async search(
		roomid: ModlogID = 'global',
		search: ModlogSearch = {},
		maxLines = 20,
		onlyPunishments = false,
	): Promise<ModlogResults> {
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
		if (Config.usesqlite && Config.usesqlitemodlog && this.databaseReady) {
			const query = await this.prepareSQLSearch(rooms, maxLines, onlyPunishments, search);
			const results = (await this.database!.all(query.statement, query.args))
				.map((row: any) => this.dbRowToModlogEntry(row));

			const duration = Date.now() - startTime;
			if (duration > LONG_QUERY_DURATION) {
				Monitor.slow(`[slow SQL modlog search] ${duration}ms - ${JSON.stringify(query)}`);
			}
			return {results, duration};
		} else {
			return {results: [], duration: -1};
		}
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
	async buildParallelIndexScanQuery(
		select: string,
		ors: SQLQuery[],
		ands: SQLQuery[],
		sortAndLimit: SQLQuery
	): Promise<ModlogSQLQuery<string | number>> {
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

		return {statement: await this.database.prepare(query), queryText: query, args};
	}

	async prepareSQLSearch(
		rooms: ModlogID[] | 'all',
		maxLines: number,
		onlyPunishments: boolean,
		search: ModlogSearch
	): Promise<ModlogSQLQuery<string | number>> {
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
			let roomChecker = `roomid IN (${Modlog.formatArray(rooms, args)})`;
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

		if (search.anyField) {
			for (const or of [
				`action LIKE ?`, `userid LIKE ?`, `autoconfirmed_userid LIKE ?`, `ip LIKE ?`, `action_taker_userid LIKE ?`,
				`EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND alts.userid LIKE ?)`,
			]) {
				ors.push({query: or, args: [search.anyField + '%']});
			}
			ors.push({query: `note LIKE ?`, args: [`%${search.anyField}%`]});
		}

		if (search.action) {
			ors.push({query: `action LIKE ?`, args: [search.action + '%']});
		} else if (onlyPunishments) {
			const args: (string | number)[] = [];
			ors.push({query: `action IN (${Modlog.formatArray(PUNISHMENTS, args)})`, args});
		}

		if (search.ip) ors.push({query: `ip LIKE ?`, args: [search.ip + '%']});
		if (search.actionTaker) ors.push({query: `action_taker_userid LIKE ?`, args: [search.actionTaker + '%']});

		if (search.note) {
			const tester = search.note.isExact ? `= ?` : `LIKE ?`;
			for (const noteSearch of search.note.searches) {
				ors.push({query: `note ${tester}`, args: [(search.note.isExact ? noteSearch + '%' : `%${noteSearch}%`)]});
			}
		}

		if (search.user) {
			if (search.user.isExact) {
				const args = [search.user.search];
				ors.push({query: `userid = ?`, args});
				ors.push({query: `autoconfirmed_userid = ?`, args});
				ors.push({query: `EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND alts.userid = ?)`, args});
			} else {
				const args = [search.user.search + '%'];
				ors.push({query: `userid LIKE ?`, args});
				ors.push({query: `autoconfirmed_userid LIKE ?`, args});
				ors.push({query: `EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND alts.userid LIKE ?)`, args});
			}
		}
		return this.buildParallelIndexScanQuery(select, ors, ands, sortAndLimit);
	}
}
