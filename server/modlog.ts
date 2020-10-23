/**
 * Modlog
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Moderator actions are logged into a set of files known as the moderation log, or "modlog."
 * This file handles reading, writing, and querying the modlog.
 *
 * @license MIT
 */

import * as child_process from 'child_process';
import {normalize as normalizePath} from 'path';
import * as util from 'util';

import {FS} from '../lib/fs';
import {QueryProcessManager} from '../lib/process-manager';
import {Repl} from '../lib/repl';
import * as Database from 'better-sqlite3';

import {parseModlog} from '../tools/modlog/converter';

const MAX_PROCESSES = 1;
// If a modlog query takes longer than this, it will be logged.
const LONG_QUERY_DURATION = 2000;
const MODLOG_PATH = 'logs/modlog';
const MODLOG_DB_PATH = `${__dirname}/../databases/modlog.db`;

const MODLOG_SCHEMA_PATH = 'databases/schemas/modlog.sql';

const GLOBAL_PUNISHMENTS = [
	'WEEKLOCK', 'LOCK', 'BAN', 'RANGEBAN', 'RANGELOCK', 'FORCERENAME',
	'TICKETBAN', 'AUTOLOCK', 'AUTONAMELOCK', 'NAMELOCK', 'AUTOBAN', 'MONTHLOCK',
];
const GLOBAL_PUNISHMENTS_REGEX_STRING = `\\b(${GLOBAL_PUNISHMENTS.join('|')}):.*`;

const PUNISHMENTS = [
	...GLOBAL_PUNISHMENTS, 'ROOMBAN', 'WEEKROOMBAN', 'UNROOMBAN', 'WARN', 'MUTE', 'HOURMUTE', 'UNMUTE',
	'CRISISDEMOTE', 'UNLOCK', 'UNLOCKNAME', 'UNLOCKRANGE', 'UNLOCKIP', 'UNBAN',
	'UNRANGEBAN', 'TRUSTUSER', 'UNTRUSTUSER', 'BLACKLIST', 'BATTLEBAN', 'UNBATTLEBAN',
	'NAMEBLACKLIST', 'KICKBATTLE', 'UNTICKETBAN', 'HIDETEXT', 'HIDEALTSTEXT', 'REDIRECT',
	'NOTE', 'MAFIAHOSTBAN', 'MAFIAUNHOSTBAN', 'GIVEAWAYBAN', 'GIVEAWAYUNBAN',
	'TOUR BAN', 'TOUR UNBAN', 'UNNAMELOCK',
];
const PUNISHMENTS_REGEX_STRING = `\\b(${PUNISHMENTS.join('|')}):.*`;

const execFile = util.promisify(child_process.execFile);

export type ModlogID = RoomID | 'global';

interface ModlogResults {
	results: ModlogEntry[];
	duration?: number;
}

interface ModlogTextQuery {
	rooms: ModlogID[];
	regexString: string;
	maxLines: number;
	onlyPunishments: boolean | string;
}

interface ModlogSQLQuery<T> {
	statement: Database.Statement<T>;
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

class SortedLimitedLengthList {
	maxSize: number;
	list: string[];

	constructor(maxSize: number) {
		this.maxSize = maxSize;
		this.list = [];
	}

	getListClone() {
		return this.list.slice();
	}

	insert(element: string) {
		let insertedAt = -1;
		for (let i = this.list.length - 1; i >= 0; i--) {
			if (element.localeCompare(this.list[i]) < 0) {
				insertedAt = i + 1;
				if (i === this.list.length - 1) {
					this.list.push(element);
					break;
				}
				this.list.splice(i + 1, 0, element);
				break;
			}
		}
		if (insertedAt < 0) this.list.splice(0, 0, element);
		if (this.list.length > this.maxSize) {
			this.list.pop();
		}
	}
}

export function checkRipgrepAvailability() {
	if (Config.ripgrepmodlog === undefined) {
		Config.ripgrepmodlog = (async () => {
			try {
				await execFile('rg', ['--version'], {cwd: normalizePath(`${__dirname}/../`)});
				await execFile('tac', ['--version'], {cwd: normalizePath(`${__dirname}/../`)});
				return true;
			} catch (error) {
				return false;
			}
		})();
	}
	return Config.ripgrepmodlog;
}

export class Modlog {
	readonly logPath: string;
	/**
	 * If a stream is undefined, that means it has not yet been initialized.
	 * If a stream is truthy, it is open and ready to be written to.
	 * If a stream is null, it has been destroyed/disabled.
	 */
	sharedStreams: Map<ID, Streams.WriteStream | null> = new Map();
	streams: Map<ModlogID, Streams.WriteStream | null> = new Map();

	readonly database: Database.Database;

	readonly modlogInsertionQuery: Database.Statement<ModlogEntry>;
	readonly FTSInsertionQuery: Database.Statement<[number, string?, string?, string?, string?]>;
	readonly altsInsertionQuery: Database.Statement<[number, string]>;
	readonly FTSAltsInsertionQuery: Database.Statement<[number, string]>;

	readonly renameQuery: Database.Statement<[string, string]>;
	readonly globalPunishmentsSearchQuery: Database.Statement<[string, string, string, number, ...string[]]>;
	readonly insertionTransaction: Database.Transaction;
	readonly altsInsertionTransaction: Database.Transaction;

	constructor(flatFilePath: string, databasePath: string) {
		this.logPath = flatFilePath;

		this.database = new Database(databasePath);
		this.database.exec("PRAGMA foreign_keys = ON;");

		// Set up tables, etc
		let tokenizer = 'unicode61';
		if (Config.modlogftsextension) {
			this.database.loadExtension('native/fts_id_tokenizer.o');
			tokenizer = 'id_tokenizer';
		}

		this.database.exec(FS(MODLOG_SCHEMA_PATH).readIfExistsSync().replace(/%TOKENIZER%/g, tokenizer));

		this.database.function(
			'regex',
			{deterministic: true},
			(regexString, toMatch) => Number(RegExp(regexString, 'i').test(toMatch))
		);


		let insertionQuerySource = `INSERT INTO modlog (timestamp, roomid, visual_roomid, action, userid, autoconfirmed_userid, ip, action_taker_userid, note)`;
		insertionQuerySource += ` VALUES ($time, $roomID, $visualRoomID, $action, $userid, $autoconfirmedID, $ip, $loggedBy, $note)`;
		this.modlogInsertionQuery = this.database.prepare(insertionQuerySource);
		this.FTSInsertionQuery = this.database.prepare(
			`INSERT INTO modlog_fts (rowid, note, userid, autoconfirmed_userid, action_taker_userid) VALUES (?, ?, ?, ?, ?)`
		);

		this.altsInsertionQuery = this.database.prepare(`INSERT INTO alts (modlog_id, userid) VALUES (?, ?)`);
		this.FTSAltsInsertionQuery = this.database.prepare(`INSERT INTO alts_fts (rowid, userid) VALUES (?, ?)`);

		this.renameQuery = this.database.prepare(`UPDATE modlog SET roomid = ? WHERE roomid = ?`);
		this.globalPunishmentsSearchQuery = this.database.prepare(
			`SELECT * FROM modlog WHERE (roomid = 'global' OR roomid LIKE 'global-%') ` +
			`AND (userid = ? OR autoconfirmed_userid = ? OR EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND userid = ?)) ` +
			`AND timestamp > ?` +
			`AND action IN (${this.formatArray(GLOBAL_PUNISHMENTS, [])}) `
		);


		this.altsInsertionTransaction = this.database.transaction((modlogID: number, userID: string) => {
			this.altsInsertionQuery.run(modlogID, userID);
			this.FTSAltsInsertionQuery.run(modlogID, userID);
		});

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
			const rowid = result.lastInsertRowid as number;

			this.FTSInsertionQuery.run(rowid, entry.note, entry.userid, entry.autoconfirmedID, entry.loggedBy);

			for (const alt of entry.alts || []) {
				this.altsInsertionTransaction(rowid, alt);
			}
		});
	}

	/******************
	 * Helper methods *
	 ******************/
	formatArray(arr: unknown[], args: unknown[]) {
		args.push(...arr);
		return [...'?'.repeat(arr.length)].join(', ');
	}

	getSharedID(roomid: ModlogID): ID | false {
		return roomid.includes('-') ? `${toID(roomid.split('-')[0])}-rooms` as ID : false;
	}

	runSQL(query: ModlogSQLQuery<any>): Database.RunResult {
		return query.statement.run(query.args);
	}

	runSQLWithResults(query: ModlogSQLQuery<any>): unknown[] {
		return query.statement.all(query.args);
	}

	generateIDRegex(search: string) {
		// Ensure the generated regex can never be greater than or equal to the value of
		// RegExpMacroAssembler::kMaxRegister in v8 (currently 1 << 16 - 1) given a
		// search with max length MAX_QUERY_LENGTH. Otherwise, the modlog
		// child process will crash when attempting to execute any RegExp
		// constructed with it (i.e. when not configured to use ripgrep).
		return `[^a-zA-Z0-9]?${[...search].join('[^a-zA-Z0-9]*')}([^a-zA-Z0-9]|\\z)`;
	}

	escapeRegex(search: string) {
		return search.replace(/[\\.+*?()|[\]{}^$]/g, '\\$&');
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
			stream = FS(`${this.logPath}/modlog_${sharedStreamId}.txt`).createAppendStream();
			this.sharedStreams.set(sharedStreamId, stream);
		}
		this.streams.set(roomid, stream);
	}

	/**
	 * Writes to the modlog
	 */
	write(roomid: string, entry: ModlogEntry, overrideID?: string) {
		roomid = entry.roomID || roomid;
		if (!Config.nosqlitemodlog) this.writeSQL(roomid, entry, overrideID);
		this.writeText(roomid, entry, overrideID);
	}

	writeSQL(roomid: string, entry: ModlogEntry, overrideID?: string) {
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

	writeText(roomid: string, entry: ModlogEntry, overrideID?: string) {
		const stream = this.streams.get(roomid as ModlogID);
		if (!stream) throw new Error(`Attempted to write to an uninitialized modlog stream for the room '${roomid}'`);

		let buf = `[${new Date(entry.time || Date.now()).toJSON()}] (${overrideID || entry.visualRoomID || roomid}) ${entry.action}:`;
		if (entry.userid) buf += ` [${entry.userid}]`;
		if (entry.autoconfirmedID) buf += ` ac:[${entry.autoconfirmedID}]`;
		if (entry.alts) buf += ` alts:[${entry.alts.join('], [')}]`;
		if (entry.ip) buf += ` [${entry.ip}]`;
		if (entry.loggedBy) buf += ` by ${entry.loggedBy}`;
		if (entry.note) buf += `: ${entry.note}`;

		void stream.write(`${buf}\n`);
	}

	async destroy(roomid: ModlogID) {
		const stream = this.streams.get(roomid);
		if (stream && !this.getSharedID(roomid)) {
			this.streams.set(roomid, null);
			await stream.writeEnd();
		}
		this.streams.set(roomid, null);
	}

	async destroyAll() {
		const promises = [];
		for (const id in this.streams) {
			promises.push(this.destroy(id as ModlogID));
		}
		return Promise.all(promises);
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
		this.runSQL({statement: this.renameQuery, args: [newID, oldID]});
	}

	getActiveStreamIDs() {
		return [...this.streams.keys()];
	}

	/******************************************
	 * Methods for reading (searching) modlog *
	 ******************************************/
	 async runTextSearch(
		rooms: ModlogID[], regexString: string, maxLines: number, onlyPunishments: boolean | string
	) {
		const useRipgrep = await checkRipgrepAvailability();
		let fileNameList: string[] = [];
		let checkAllRooms = false;
		for (const roomid of rooms) {
			if (roomid === 'all') {
				checkAllRooms = true;
				const fileList = await FS(this.logPath).readdir();
				for (const file of fileList) {
					if (file !== 'README.md' && file !== 'modlog_global.txt') fileNameList.push(file);
				}
			} else {
				fileNameList.push(`modlog_${roomid}.txt`);
			}
		}
		fileNameList = fileNameList.map(filename => `${this.logPath}/${filename}`);

		if (onlyPunishments) {
			regexString = `${onlyPunishments === 'global' ? GLOBAL_PUNISHMENTS_REGEX_STRING : PUNISHMENTS_REGEX_STRING}${regexString}`;
		}

		const results = new SortedLimitedLengthList(maxLines);
		if (useRipgrep) {
			if (checkAllRooms) fileNameList = [this.logPath];
			await this.runRipgrepSearch(fileNameList, regexString, results, maxLines);
		} else {
			const searchStringRegex = new RegExp(regexString, 'i');
			for (const fileName of fileNameList) {
				await this.readRoomModlog(fileName, results, searchStringRegex);
			}
		}
		return results.getListClone().filter(Boolean);
	}

	async runRipgrepSearch(paths: string[], regexString: string, results: SortedLimitedLengthList, lines: number) {
		let output;
		try {
			const options = [
				'-i',
				'-m', '' + lines,
				'--pre', 'tac',
				'-e', regexString,
				'--no-filename',
				'--no-line-number',
				...paths,
				'-g', '!modlog_global.txt', '-g', '!README.md',
			];
			output = await execFile('rg', options, {cwd: normalizePath(`${__dirname}/../`)});
		} catch (error) {
			return results;
		}
		for (const fileName of output.stdout.split('\n').reverse()) {
			if (fileName) results.insert(fileName);
		}
		return results;
	}

	async getGlobalPunishments(user: User | string, days = 30) {
		return this.getGlobalPunishmentsText(toID(user), days);
	}

	async getGlobalPunishmentsText(userid: ID, days: number) {
		const response = await PM.query({
			rooms: ['global' as ModlogID],
			regexString: this.escapeRegex(`[${userid}]`),
			maxLines: days * 10,
			onlyPunishments: 'global',
		});
		return response.length;
	}

	getGlobalPunishmentsSQL(userid: ID, days: number) {
		const args: (string | number)[] = [
			userid, userid, userid, Date.now() - (days * 24 * 60 * 60 * 1000), ...GLOBAL_PUNISHMENTS,
		];
		const results = this.runSQLWithResults({statement: this.globalPunishmentsSearchQuery, args});
		return results.length;
	}

	async search(
		roomid: ModlogID = 'global',
		search: ModlogSearch = {},
		maxLines = 20,
		onlyPunishments = false,
	): Promise<ModlogResults> {
		const rooms = (roomid === 'public' ?
			[...Rooms.rooms.values()]
				.filter(room => !room.settings.isPrivate && !room.settings.isPersonal)
				.map(room => room.roomid) :
			[roomid]);

		const query = this.prepareSearch(rooms, maxLines, onlyPunishments, search);
		const response = await PM.query(query);

		if (response.duration > LONG_QUERY_DURATION) {
			Monitor.log(`Long modlog query took ${response.duration} ms to complete: ${JSON.stringify(query)}`);
		}
		return {results: response, duration: response.duration};
	}

	prepareSearch(rooms: ModlogID[], maxLines: number, onlyPunishments: boolean, search: ModlogSearch) {
		return this.prepareTextSearch(rooms, maxLines, onlyPunishments, search);
	}

	prepareTextSearch(
		rooms: ModlogID[],
		maxLines: number,
		onlyPunishments: boolean,
		search: ModlogSearch
	): ModlogTextQuery {
		// Ensure regexString can never be greater than or equal to the value of
		// RegExpMacroAssembler::kMaxRegister in v8 (currently 1 << 16 - 1) given a
		// searchString with max length MAX_QUERY_LENGTH. Otherwise, the modlog
		// child process will crash when attempting to execute any RegExp
		// constructed with it (i.e. when not configured to use ripgrep).
		let regexString = '.*?';
		if (search.anyField) regexString += `${this.escapeRegex(search.anyField)}.*?`;
		if (search.action) regexString += `\\) .*?${this.escapeRegex(search.action)}.*?: .*?`;
		if (search.user) {
			const wildcard = search.user.isExact ? `` : `.*?`;
			regexString += `.*?\\[${wildcard}${this.escapeRegex(search.user.search)}${wildcard}\\].*?`;
		}
		if (search.ip) regexString += `${this.escapeRegex(`[${search.ip}`)}.*?\\].*?`;
		if (search.actionTaker) regexString += `${this.escapeRegex(`by ${search.actionTaker}`)}.*?`;
		if (search.note) {
			const regexGenerator = search.note.isExact ? this.generateIDRegex : this.escapeRegex;
			for (const noteSearch of search.note.searches) {
				regexString += `${regexGenerator(toID(noteSearch))}.*?`;
			}
		}

		return {
			rooms: rooms,
			regexString,
			maxLines: maxLines,
			onlyPunishments: onlyPunishments,
		};
	}

	prepareSQLSearch(
		rooms: ModlogID[],
		maxLines: number,
		onlyPunishments: boolean,
		search: ModlogSearch
	): ModlogSQLQuery<string | number> {
		for (const room of [...rooms]) {
			rooms.push(`global-${room}` as ModlogID);
		}

		const args: (string | number)[] = [];

		let roomChecker = `roomid IN (${this.formatArray(rooms, args)})`;
		if (rooms.includes('global')) roomChecker = `(roomid LIKE 'global-%' OR ${roomChecker})`;

		let query = `SELECT *, (SELECT group_concat(userid, ',') FROM alts WHERE alts.modlog_id = modlog.modlog_id) as alts FROM modlog`;
		query += ` LEFT JOIN modlog_fts ON modlog_fts.rowid = modlog_id`;
		query += ` WHERE ${roomChecker}`;

		if (search.anyField) {
			query += ` AND action LIKE ? || '%'`;

			query += ` OR modlog_fts.userid MATCH ?`;
			query += ` OR modlog_fts.autoconfirmed_userid LIKE ?`;
			query += ` OR EXISTS(SELECT * FROM alts JOIN alts_fts ON alts_fts.rowid = alts.rowid WHERE alts.modlog_id = modlog.modlog_id AND alts_fts.userid MATCH ?)`;
			query += ` OR modlog_fts.action_taker_userid MATCH ?`;

			query += ` OR ip LIKE ? || '%'`;

			args.push(...Array(6).fill(search.anyField));

			query += ` OR modlog_fts.note MATCH ?`;
			args.push(toID(search.anyField));
		}

		if (search.action) {
			query += ` AND action LIKE ? || '%'`;
			args.push(search.action);
		} else if (onlyPunishments) {
			query += ` AND action IN (${this.formatArray(PUNISHMENTS, args)})`;
		}

		if (search.user) {
			if (search.user.isExact) {
				query += [
					` AND (`,
					`modlog_fts.userid MATCH ? OR`,
					`modlog_fts.autoconfirmed_userid MATCH ? OR`,
					`EXISTS(SELECT * FROM alts JOIN alts_fts ON alts_fts.rowid = modlog.rowid WHERE alts.modlog_id = modlog.modlog_id AND alts_fts.userid MATCH ?)`,
					`)`,
				].join(' ');
				args.push(search.user.search, search.user.search, search.user.search);
			} else {
				query += [
					` AND (`,
					`modlog.userid = ? OR`,
					`modlog.autoconfirmed_userid = ? OR`,
					`EXISTS(SELECT * FROM alts WHERE alts.modlog_id = modlog.modlog_id AND alts.userid = ?)`,
					`)`,
				].join(' ');
				args.push(search.user.search, search.user.search, search.user.search);
			}
		}

		if (search.ip) {
			query += ` AND ip LIKE ? || '%'`;
			args.push(search.ip);
		}

		if (search.actionTaker) {
			query += ` AND modlog_fts.action_taker_userid MATCH ?`;
			args.push(search.actionTaker);
		}

		if (search.note) {
			const parts = [];
			for (const noteSearch of search.note.searches) {
				parts.push(`modlog_fts.note MATCH ?`);
				args.push(toID(noteSearch));
			}
			query += ` AND ${parts.join(' OR ')}`;
		}

		query += ` ORDER BY timestamp DESC`;
		if (maxLines) {
			query += ` LIMIT ?`;
			args.push(maxLines);
		}

		return {statement: this.database.prepare(query), args};
	}

	private async readRoomModlog(path: string, results: SortedLimitedLengthList, regex?: RegExp) {
		const fileStream = FS(path).createReadStream();
		for await (const line of fileStream.byLine()) {
			if (!regex || regex.test(line)) {
				results.insert(line);
			}
		}
		void fileStream.destroy();
		return results;
	}
}

// if I don't do this TypeScript thinks that (ModlogResult | undefined)[] is a function
// and complains about an "nexpected newline between function name and paren"
// even though it's a type not a function...
type ModlogResult = ModlogEntry | undefined;


// the ProcessManager only accepts text queries at this time
// SQL support is to be determined
export const PM = new QueryProcessManager<ModlogTextQuery, ModlogResult[]>(module, async data => {
	const {rooms, regexString, maxLines, onlyPunishments} = data;
	try {
		const results = await modlog.runTextSearch(rooms, regexString, maxLines, onlyPunishments);
		return results.map((line: string, index: number) => parseModlog(line, results[index + 1]));
	} catch (err) {
		Monitor.crashlog(err, 'A modlog query', data);
		return [];
	}
});

if (!PM.isParentProcess) {
	global.Config = require('./config-loader').Config;
	global.toID = require('../sim/dex').Dex.toID;

	global.Monitor = {
		crashlog(error: Error, source = 'A modlog process', details: AnyObject | null = null) {
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

export const modlog = new Modlog(MODLOG_PATH, MODLOG_DB_PATH);
