
/**
 * Converts modlogs between text and SQLite; also modernizes old-format modlogs
 * @author Annika
 * @author jetou
 */

// @ts-ignore Needed for FS
if (!global.Config) global.Config = {nofswriting: false};

import iterateLines = require('lines-async-iterator');

import {FS} from '../../lib/fs';
import {ModlogEntry} from '../../server/modlog';
import {IPTools} from '../../server/ip-tools';

type ModlogFormat = 'txt';

/** The number of modlog entries to write to the database on each transaction */
const ENTRIES_TO_BUFFER = 100;

export function parseBrackets(line: string, openingBracket: '(' | '[') {
	const brackets = {
		'(': ')',
		'[': ']',
	};
	const bracketOpenIndex = line.indexOf(openingBracket);
	const bracketCloseIndex = line.indexOf(brackets[openingBracket]);
	if (bracketCloseIndex < 0 || bracketOpenIndex < 0) return '';
	return line.slice(bracketOpenIndex + 1, bracketCloseIndex);
}

function toID(text: any): ID {
	return (text && typeof text === "string" ? text : "").toLowerCase().replace(/[^a-z0-9]+/g, "") as ID;
}

export function modernizeLog(line: string, nextLine?: string) {
	// first we save and remove the timestamp and the roomname
	const prefix = line.match(/\[.+?\] \(.+?\) /i)?.[0];
	if (!prefix) return;
	if (/\]'s\s.*\salts: \[/.test(line)) return;
	line = line.replace(prefix, '');

	if (line.startsWith('(') && line.endsWith(')')) {
		line = line.slice(1, -1);
	}
	const getAlts = (userid: ID) => {
		let alts;
		const regex = new RegExp(`\\(\\[.*\\]'s (locked|muted|banned) alts: (\\[.*\\])\\)`);
		nextLine?.replace(regex, (a, b, rawAlts) => {
			alts = rawAlts;
			return '';
		});
		return alts ? `alts: ${alts} ` : ``;
	};

	// Special cases

	if (line.startsWith('SCAV ')) {
		line = line.replace(/: (\[room: .*?\]) by (.*)/, (match, roominfo, rest) => `: by ${rest} ${roominfo}`);
	}
	line = line.replace(/(GIVEAWAY WIN|GTS FINISHED): (.*?)(won|has finished)/, (match, action, user) => {
		return `${action}: [${toID(user)}]:`;
	});

	if (line.includes(':')) {
		const possibleModernAction = line.slice(0, line.indexOf(':')).trim();
		if (possibleModernAction === possibleModernAction.toUpperCase()) {
			// Log is already modernized
			return `${prefix}${line}`;
		}
	}

	if (/\[(the|a)poll\] was (started|ended) by/.test(line)) {
		const actionTaker = toID(line.slice(line.indexOf(' by ') + ' by '.length));
		const isEnding = line.includes('was ended by');
		return `${prefix}POLL${isEnding ? ' END' : ''}: by ${actionTaker}`;
	}
	if (/User (.*?) won the game of (.*?) mode trivia/.test(line)) {
		return `${prefix}TRIVIAGAME: by unknown: ${line}`;
	}

	const modernizerTransformations: {[k: string]: (log: string) => string} = {
		'changed the roomdesc to: ': (log) => {
			const actionTaker = parseBrackets(log, '[');
			log = log.slice(actionTaker.length + 3);
			log = log.slice('changed the roomdesc to: '.length + 1, -2);
			return `ROOMDESC: by ${actionTaker}: to "${log}"`;
		},

		' declared ': (log) => {
			let newAction = 'DECLARE';
			let oldAction = ' declared ';
			if (log.includes(' globally declared ')) {
				oldAction = ' globally declared ';
				newAction = 'GLOBALDECLARE';
			}
			if (log.includes('(chat level)')) {
				oldAction += '(chat level) ';
				newAction = `CHATDECLARE`;
			}

			const actionTakerName = toID(log.slice(0, log.lastIndexOf(oldAction)));

			log = log.slice(actionTakerName.length);
			log = log.slice(oldAction.length);
			return `${newAction}: by ${actionTakerName}: ${log}`;
		},

		'roomevent titled "': (log) => {
			let action;
			if (log.includes(' added a roomevent titled "')) {
				action = 'added a';
			} else if (log.includes(' removed a roomevent titled "')) {
				action = 'removed a';
			} else {
				action = 'edited the';
			}
			const actionTakerName = log.slice(0, log.lastIndexOf(` ${action} roomevent titled "`));
			log = log.slice(actionTakerName.length + 1);
			const eventName = log.slice(` ${action} roomevent titled `.length, -2);
			return `ROOMEVENT: by ${toID(actionTakerName)}: ${action.split(' ')[0]} "${eventName}"`;
		},

		'was promoted to ': (log) => {
			const isDemotion = log.includes('was demoted to ');
			const userid = parseBrackets(log, '[');
			log = log.slice(userid.length + 3);
			log = log.slice(`was ${isDemotion ? 'demoted' : 'promoted'} to `.length);
			let rank = log.slice(0, log.indexOf(' by')).replace(/ /, '').toUpperCase();

			log = log.slice(`${rank} by `.length);
			if (!rank.startsWith('ROOM')) rank = `GLOBAL ${rank}`;
			const actionTaker = parseBrackets(log, '[');
			return `${rank}: [${userid}] by ${actionTaker}${isDemotion ? ': (demote)' : ''}`;
		},
		'was demoted to ': (log) => modernizerTransformations['was promoted to '](log),
		'was appointed Room Owner by ': (log) => {
			const userid = parseBrackets(log, '[');
			log = log.slice(userid.length + 3);
			log = log.slice('was appointed Room Owner by '.length);
			const actionTaker = parseBrackets(log, '[');
			return `ROOMOWNER: [${userid}] by ${actionTaker}`;
		},

		'set modchat to ': (log) => {
			const actionTaker = parseBrackets(log, '[');
			log = log.slice(actionTaker.length + 3);
			log = log.slice('set modchat to '.length);
			return `MODCHAT: by ${actionTaker}: to ${log}`;
		},
		'set modjoin to ': (log) => {
			const actionTakerName = log.slice(0, log.lastIndexOf(' set'));
			log = log.slice(actionTakerName.length + 1);
			log = log.slice('set modjoin to '.length);
			const rank = log.startsWith('sync') ? 'sync' : log.replace('.', '');
			return `MODJOIN${rank === 'sync' ? ' SYNC' : ''}: by ${toID(actionTakerName)}${rank !== 'sync' ? `: ${rank}` : ``}`;
		},
		'turned off modjoin': (log) => {
			const actionTakerName = log.slice(0, log.lastIndexOf(' turned off modjoin'));
			return `MODJOIN: by ${toID(actionTakerName)}: OFF`;
		},

		'notes: ': (log) => {
			const actionTaker = parseBrackets(log, '[');
			log = log.slice(actionTaker.length + 3);
			log = log.slice('notes: '.length);
			return `NOTE: by ${actionTaker}: ${log}`;
		},

		'changed the roomintro': (log) => {
			const isDeletion = /deleted the (staff|room)intro/.test(log);
			const isRoomintro = log.includes('roomintro');
			const actionTaker = toID(log.slice(0, log.indexOf(isDeletion ? 'deleted' : 'changed')));
			return `${isDeletion ? 'DELETE' : ''}${isRoomintro ? 'ROOM' : 'STAFF'}INTRO: by ${actionTaker}`;
		},
		'deleted the roomintro': (log) => modernizerTransformations['changed the roomintro'](log),
		'changed the staffintro': (log) => modernizerTransformations['changed the roomintro'](log),
		'deleted the staffintro': (log) => modernizerTransformations['changed the roomintro'](log),

		'created a tournament in': (log) => {
			const actionTaker = parseBrackets(log, '[');
			log = log.slice(actionTaker.length + 3);
			log = log.slice(24, -8);
			return `TOUR CREATE: by ${actionTaker}: ${log}`;
		},
		'was disqualified from the tournament by': (log) => {
			const disqualified = parseBrackets(log, '[');
			log = log.slice(disqualified.length + 3);
			log = log.slice('was disqualified from the tournament by'.length);
			return `TOUR DQ: [${toID(disqualified)}] by ${toID(log)}`;
		},
		'The tournament auto disqualify timeout was set to': (log) => {
			const byIndex = log.indexOf(' by ');
			const actionTaker = log.slice(byIndex + ' by '.length);
			const length = log.slice('The tournament auto disqualify timeout was set to'.length, byIndex);
			return `TOUR AUTODQ: by ${toID(actionTaker)}: ${length.trim()}`;
		},

		' was banned from room ': (log) => {
			const banned = toID(log.slice(0, log.indexOf(' was banned from room ')));
			log = log.slice(log.indexOf(' by ') + ' by '.length);
			let reason, ip;
			if (/\(.*\)/.test(log)) {
				reason = parseBrackets(log, '(');
				if (/\[.*\]/.test(log)) ip = parseBrackets(log, '[');
				log = log.slice(0, log.indexOf('('));
			}
			const actionTaker = toID(log);
			return `ROOMBAN: [${banned}] ${getAlts(banned)}${ip ? `[${ip}] ` : ``}by ${actionTaker}${reason ? `: ${reason}` : ``}`;
		},
		' was muted by ': (log) => {
			let muted = '';
			let isHour = false;
			[muted, log] = log.split(' was muted by ');
			muted = toID(muted);
			let reason, ip;
			if (/\(.*\)/.test(log)) {
				reason = parseBrackets(log, '(');
				if (/\[.*\]/.test(log)) ip = parseBrackets(log, '[');
				log = log.slice(0, log.indexOf('('));
			}
			let actionTaker = toID(log);
			if (actionTaker.endsWith('for1hour')) {
				isHour = true;
				actionTaker = actionTaker.replace(/^(.*)(for1hour)$/, (match, staff) => staff) as ID;
			}
			return `${isHour ? 'HOUR' : ''}MUTE: [${muted}] ${getAlts(muted as ID)}${ip ? `[${ip}] ` : ``}by ${actionTaker}${reason ? `: ${reason}` : ``}`;
		},
		' was locked from talking ': (log) => {
			const isWeek = log.includes(' was locked from talking for a week ');
			const locked = toID(log.slice(0, log.indexOf(' was locked from talking ')));
			log = log.slice(log.indexOf(' by ') + ' by '.length);
			let reason, ip;
			if (/\(.*\)/.test(log)) {
				reason = parseBrackets(log, '(');
				if (/\[.*\]/.test(log)) ip = parseBrackets(log, '[');
				log = log.slice(0, log.indexOf('('));
			}
			const actionTaker = toID(log);
			return `${isWeek ? 'WEEK' : ''}LOCK: [${locked}] ${getAlts(locked)}${ip ? `[${ip}] ` : ``}by ${actionTaker}${reason ? `: ${reason}` : ``}`;
		},
		' was banned ': (log) => {
			if (log.includes(' was banned from room ')) return modernizerTransformations[' was banned from room '](log);
			const banned = toID(log.slice(0, log.indexOf(' was banned ')));
			log = log.slice(log.indexOf(' by ') + ' by '.length);
			let reason, ip;
			if (/\(.*\)/.test(log)) {
				reason = parseBrackets(log, '(');
				if (/\[.*\]/.test(log)) ip = parseBrackets(log, '[');
				log = log.slice(0, log.indexOf('('));
			}
			const actionTaker = toID(log);
			return `BAN: [${banned}] ${getAlts(banned)}${ip ? `[${ip}] ` : ``}by ${actionTaker}${reason ? `: ${reason}` : ``}`;
		},

		' claimed this ticket': (log) => {
			const actions: {[k: string]: string} = {
				' claimed this ticket': 'TICKETCLAIM',
				' closed this ticket': 'TICKETCLOSE',
				' deleted this ticket': 'TICKETDELETE',
			};
			for (const oldAction in actions) {
				if (log.includes(oldAction)) {
					const actionTaker = toID(log.slice(0, log.indexOf(oldAction)));
					return `${actions[oldAction]}: by ${actionTaker}`;
				}
			}
			return log;
		},
		'This ticket is now claimed by ': (log) => {
			const claimer = toID(log.slice(log.indexOf(' by ') + ' by '.length));
			return `TICKETCLAIM: by ${claimer}`;
		},
		' is no longer interested in this ticket': (log) => {
			const abandoner = toID(log.slice(0, log.indexOf(' is no longer interested in this ticket')));
			return `TICKETABANDON: by ${abandoner}`;
		},
		' opened a new ticket': (log) => {
			const opener = toID(log.slice(0, log.indexOf(' opened a new ticket')));
			const problem = log.slice(log.indexOf(' Issue: ') + ' Issue: '.length).trim();
			return `TICKETOPEN: by ${opener}: ${problem}`;
		},
		' closed this ticket': (log) => modernizerTransformations[' claimed this ticket'](log),
		' deleted this ticket': (log) => modernizerTransformations[' claimed this ticket'](log),
		'This ticket is no longer claimed': () => 'TICKETUNCLAIM',

		' has been caught attempting a hunt with ': (log) => {
			const index = log.indexOf(' has been caught attempting a hunt with ');
			const user = toID(log.slice(0, index));
			log = log.slice(index + ' has been caught attempting a hunt with '.length);
			log = log.replace('. The user has also', '; has also').replace('.', '');
			return `SCAV CHEATER: [${user}]: caught attempting a hunt with ${log}`;
		},
	};

	for (const oldAction in modernizerTransformations) {
		if (line.includes(oldAction)) return prefix + modernizerTransformations[oldAction](line);
	}

	return `${prefix}${line}`;
}

export function parseModlog(raw: string, nextLine?: string, isGlobal = false): ModlogEntry | undefined {
	let line = modernizeLog(raw);
	if (!line) return;

	const log: ModlogEntry = {action: 'NULL', isGlobal};
	const timestamp = parseBrackets(line, '[');
	log.time = Math.floor(new Date(timestamp).getTime());
	line = line.slice(timestamp.length + 3);

	const [roomid, ...bonus] = parseBrackets(line, '(').split(' ');
	log.roomID = roomid;
	if (bonus.length) log.visualRoomID = `${roomid} ${bonus.join(' ')}`;
	line = line.slice((log.visualRoomID || log.roomID).length + 3);
	const actionColonIndex = line.indexOf(':');
	const action = line.slice(0, actionColonIndex);
	if (action !== action.toUpperCase()) {
		// no action (probably an old-format log that slipped past the modernizer)
		log.action = 'OLD MODLOG';
		log.loggedBy = 'unknown' as ID;
		log.note = line.trim();
		return log;
	} else {
		log.action = action;
		if (log.action === 'OLD MODLOG') {
			log.loggedBy = 'unknown' as ID;
			log.note = line.slice(line.indexOf('by unknown: ') + 'by unknown :'.length).trim();
			return log;
		}
		line = line.slice(actionColonIndex + 2);
	}

	if (line[0] === '[') {
		const userid = toID(parseBrackets(line, '['));
		log.userid = userid;
		line = line.slice(userid.length + 3).trim();
		if (line.startsWith('ac:')) {
			line = line.slice(3).trim();
			const ac = parseBrackets(line, '[');
			log.autoconfirmedID = toID(ac);
			line = line.slice(ac.length + 3).trim();
		}
		if (line.startsWith('alts:')) {
			line = line.slice(5).trim();
			const alts = new Set<ID>(); // we need to weed out duplicate alts
			let alt = parseBrackets(line, '[');
			do {
				if (IPTools.ipRegex.test(alt)) break;
				alts.add(toID(alt));
				line = line.slice(line.indexOf(`[${alt}],`) + `[${alt}],`.length).trim();
				alt = parseBrackets(line, '[');
			} while (alt);
			log.alts = [...alts];
		}
		if (line[0] === '[') {
			log.ip = parseBrackets(line, '[');
			line = line.slice(log.ip.length + 3).trim();
		}
	}

	let regex = /by .*:/;
	let actionTakerIndex = regex.exec(line)?.index;
	if (!actionTakerIndex && actionTakerIndex !== 0) {
		actionTakerIndex = line.indexOf('by ');
		regex = /by .*/;
	}
	if (actionTakerIndex !== -1) {
		const colonIndex = line.indexOf(': ');
		const actionTaker = line.slice(actionTakerIndex + 3, colonIndex > -1 ? colonIndex : undefined);
		log.loggedBy = toID(actionTaker) || undefined;
		if (colonIndex > -1) line = line.slice(colonIndex);
		line = line.replace(regex, '').replace(/^\s?:\s?/, '');
	}
	if (line) log.note = line.trim();

	return log;
}

export function rawifyLog(log: ModlogEntry) {
	let result = `[${new Date(log.time || Date.now()).toJSON()}] (${(log.visualRoomID || log.roomID || 'global').replace(/^global-/, '')}) ${log.action}`;
	if (log.userid) result += `: [${log.userid}]`;
	if (log.autoconfirmedID) result += ` ac: [${log.autoconfirmedID}]`;
	if (log.alts) result += ` alts: [${log.alts.join('], [')}]`;
	if (log.ip) result += ` [${log.ip}]`;
	if (log.loggedBy) result += `${result.endsWith(']') ? '' : ':'} by ${log.loggedBy}`;
	if (log.note) result += `: ${log.note}`;
	return result + `\n`;
}

export class ModlogConverterTest {
	readonly inputDir: string;
	readonly outputDir: string;

	constructor(inputDir: string, outputDir: string) {
		this.inputDir = inputDir;
		this.outputDir = outputDir;
	}

	async toTxt() {
		const files = await FS(this.inputDir).readdir();
		// Read global modlog last to avoid inserting duplicate data to database
		if (files.includes('modlog_global.txt')) {
			files.splice(files.indexOf('modlog_global.txt'), 1);
			files.push('modlog_global.txt');
		}

		const globalEntries = [];

		for (const file of files) {
			if (file === 'README.md') continue;
			const roomid = file.slice(7, -4);

			let entriesLogged = 0;
			let lastLine = undefined;
			let entries: string[] = [];

			const insertEntries = async () => {
				entriesLogged += entries.length;
				if (!Config.nofswriting && (entriesLogged % ENTRIES_TO_BUFFER === 0 || entriesLogged < ENTRIES_TO_BUFFER)) {
					process.stdout.clearLine(0);
					process.stdout.cursorTo(0);
					process.stdout.write(`Wrote ${entriesLogged} entries from '${roomid}'`);
				}
				await FS(`${this.outputDir}/modlog_${roomid}.txt`).append(entries.join(''));
				entries = [];
			};

			for await (const line of iterateLines(`${this.inputDir}/${file}`)) {
				const entry = parseModlog(line, lastLine, roomid === 'global');
				lastLine = line;
				if (!entry || roomid === 'global' && entry.roomID === 'global') continue;
				const rawLog = rawifyLog(entry);
				entries.push(rawLog);
				if (entry.isGlobal) {
					globalEntries.push(rawLog);
				}
				if (entries.length === ENTRIES_TO_BUFFER) await insertEntries();
			}
			await insertEntries();
			if (entriesLogged) process.stdout.write('\n');
		}

		if (!Config.nofswriting) console.log(`Writing the global modlog...`);
		await FS(`${this.outputDir}/modlog_global.txt`).append(globalEntries.join(''));
	}
}

export class ModlogConverter {
	static async convert(
		from: ModlogFormat, to: ModlogFormat, databasePath: string,
		textLogDirectoryPath: string, outputLogPath?: string
	) {
		if (from === 'txt' && to === 'txt' && outputLogPath) {
			const converter = new ModlogConverterTest(textLogDirectoryPath, outputLogPath);
			return converter.toTxt().then(() => {
				console.log("\nDone!");
				process.exit();
			});
		}
	}
}
