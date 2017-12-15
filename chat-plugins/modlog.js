'use strict';

const FS = require('./../fs');
const path = require('path');
const Dashycode = require('../lib/dashycode');
const ProcessManager = require('./../process-manager');
const execFileSync = require('child_process').execFileSync;

const MAX_PROCESSES = 1;
const MAX_QUERY_LENGTH = 2500;
const DEFAULT_RESULTS_LENGTH = 100;
const MORE_BUTTON_INCREMENTS = [200, 400, 800, 1600, 3200];
const LINES_SEPARATOR = 'lines=';
const MAX_RESULTS_LENGTH = MORE_BUTTON_INCREMENTS[MORE_BUTTON_INCREMENTS.length - 1];
const LOG_PATH = 'logs/modlog/';

class ModlogManager extends ProcessManager {
	onMessageUpstream(message) {
		// Protocol:
		// when crashing: 	  "[id]|0"
		// when not crashing: "[id]|1|[results]"
		let pipeIndex = message.indexOf('|');
		let id = +message.substr(0, pipeIndex);

		if (this.pendingTasks.has(id)) {
			this.pendingTasks.get(id)(message.slice(pipeIndex + 1));
			this.pendingTasks.delete(id);
			this.release();
		}
	}

	async onMessageDownstream(message) {
		// protocol:
		// "[id]|[comma-separated list of room ids]|[searchString]|[maxLines]"
		const parts = message.split('|');

		const id = parts[0];
		const rooms = parts[1];
		const searchString = parts.slice(2, -1).join('|');
		const maxLines = parts[parts.length - 1];

		process.send(id + '|' + await this.receive(rooms, searchString, maxLines));
	}

	async receive(rooms, searchString, maxLines) {
		let result = '';
		maxLines = Number(maxLines);
		try {
			const searchResults = await runModlog(rooms.split(','), searchString, maxLines);
			result = `${searchResults.searchType}|${searchResults.text}`;
		} catch (err) {
			require('../crashlogger')(err, 'A modlog query', {
				rooms: rooms,
				searchString: searchString,
				maxLines: maxLines,
			});
			result = '0';
		}
		return result;
	}
}

exports.ModlogManager = ModlogManager;

const PM = exports.PM = new ModlogManager({
	execFile: __filename,
	maxProcesses: MAX_PROCESSES,
	isChatBased: true,
});

if (process.send && module === process.mainModule) {
	global.Config = require('../config/config');
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			require('../crashlogger')(err, 'A modlog child process');
		}
	});
	global.Dex = require('../sim/dex');
	global.toId = Dex.getId;
	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit());
	require('../repl').start('modlog', cmd => eval(cmd));
} else {
	PM.spawn();
}

class SortedLimitedLengthList {
	constructor(maxSize) {
		this.maxSize = maxSize;
		this.list = [];
	}

	getListClone() {
		return this.list.slice(0);
	}

	tryInsert(element) {
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
			if (insertedAt === this.list.length) return false;
		}
		return true;
	}
}

function checkRipgrepAvailability() {
	if (Config.ripgrepmodlog === undefined) {
		try {
			execFileSync('rg', ['--version'], {cwd: path.normalize(`${__dirname}/../`)});
			Config.ripgrepmodlog = true;
		} catch (error) {
			Config.ripgrepmodlog = false;
		}
	}
	return Config.ripgrepmodlog;
}

function getMoreButton(room, search, lines, maxLines) {
	let newLines = 0;
	for (let increase of MORE_BUTTON_INCREMENTS) {
		if (increase > lines) {
			newLines = increase;
			break;
		}
	}
	if (!newLines || lines < maxLines) {
		return ''; // don't show a button if no more pre-set increments are valid or if the amount of results is already below the max
	} else {
		search = Chat.escapeHTML(`${search}`);
		return `<br /><div style="float:right"><button class="button" name="send" value="/modlog ${room}, ${search} ${LINES_SEPARATOR}${newLines}" title="View more results">More results...</button></div>`;
	}
}

function toModlogId(text) {
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9*]+/g, '').replace(/\*+/g, '.*');
}

function escapeRegex(str) {
	return (str && typeof str === 'string' ? str : '').replace(/[\\.+*?!=()|[\]{}^$#<>]/g, '\\$&');
}

function formatSingleSearch(string) {
	const searchType = string.trim().charAt(0) === '!' ? 'negative' : 'positive';
	if (searchType === 'negative') {
		string = string.slice(1);
	}

	const parts = string.split('||');
	let formattedParts = [];

	for (let p of parts) {
		p = p.trim();
		const exactSearch = /^(["']).+\1$/i.test(p);
		if (exactSearch) {
			p = p.slice(1, -1);
			formattedParts.push(escapeRegex(p));
		} else {
			formattedParts.push(`[^a-zA-Z0-9]${toModlogId(p)}[^a-zA-Z0-9]`);
		}
	}

	const result = {searchType, term: (formattedParts.length > 1 ? `(${formattedParts.join('|')})` : formattedParts[0])};
	return result;
}

function formatRegexString(string) {
	if (!string) return {type: 0, searchRegex: '.'};
	const parts = string.split('&&');
	if (parts.length === 1 && string.charAt(0) !== '!' && !string.includes('||')) {
		// single argument searches
		if (/^(["']).+\1$/i.test(string)) {
			// exact search
			return {type: 1, searchRegex: escapeRegex(string.slice(1, -1))};
		} else {
			// userid search
			return {type: 0, searchRegex: `[^a-zA-Z0-9]${toModlogId(string)}[^a-zA-Z0-9]`};
		}
	} else {
		// searches with multiple arguments
		let results = {positive: [], negative: []};

		// format each search term
		for (let p of parts) {
			const res = formatSingleSearch(p);
			results[res.searchType].push(res.term);
		}

		// format the positive searches
		const positive = results.positive.map(t => `(?=.*${t})`).join('');
		const negative = results.negative.length ? results.negative.map(t => `(?!${results.negative.join('|')})`) : '';
		const searchRegex = `^${positive}(?:${negative}.)*$`;
		return {type: 2, searchRegex};
	}
}

async function runModlog(rooms, searchString, maxLines) {
	const useRipgrep = checkRipgrepAvailability();
	let fileNameList = [];
	let checkAllRooms = false;
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i] === 'all') {
			checkAllRooms = true;
			const fileList = await FS(LOG_PATH).readdir();
			for (let i = 0; i < fileList.length; i++) {
				fileNameList.push(fileList[i]);
			}
		} else {
			fileNameList.push(`modlog_${rooms[i]}.txt`);
		}
	}
	fileNameList = fileNameList.map(filename => `${LOG_PATH}${filename}`);

	// Ensure regexString can never be greater than or equal to the value of
	// RegExpMacroAssembler::kMaxRegister in v8 (currently 1 << 16 - 1) given a
	// searchString with max length MAX_QUERY_LENGTH. Otherwise, the modlog
	// child process will crash when attempting to execute any RegExp
	// constructed with it (i.e. when not configured to use ripgrep).

	const {searchRegex: regexString, type: searchType = 0} = formatRegexString(searchString);

	let results = new SortedLimitedLengthList(maxLines);
	if (useRipgrep && searchString) {
		// the entire directory is searched by default, no need to list every file manually
		if (checkAllRooms) fileNameList = [LOG_PATH];
		runRipgrepModlog(fileNameList, regexString, results);
	} else {
		const searchStringRegex = new RegExp(regexString, 'i');
		for (let i = 0; i < fileNameList.length; i++) {
			await checkRoomModlog(fileNameList[i], searchStringRegex, results);
		}
	}
	const resultData = results.getListClone();
	return {text: resultData.join('\n'), searchType};
}

async function checkRoomModlog(path, regex, results) {
	const fileContents = await FS(path).readTextIfExists();
	for (const line of fileContents.toString().split('\n').reverse()) {
		if (regex.test(line)) {
			const insertionSuccessful = results.tryInsert(line);
			if (!insertionSuccessful) break;
		}
	}
	return results;
}

function runRipgrepModlog(paths, regexString, results) {
	let stdout;
	try {
		stdout = execFileSync('rg', ['-i', '-e', regexString, '--no-filename', '--no-line-number', ...paths], {cwd: path.normalize(`${__dirname}/../`)});
	} catch (error) {
		return results;
	}
	const fileResults = stdout.toString().split('\n').reverse();
	for (let i = 0; i < fileResults.length; i++) {
		if (fileResults[i]) results.tryInsert(fileResults[i]);
	}
	return results;
}

function prettifyResults(rawResults, room, searchString, searchType, addModlogLinks, hideIps, maxLines) {
	if (rawResults === '0') {
		return "The modlog query has crashed.";
	}
	let roomName;
	switch (room) {
	case 'all':
		roomName = "all rooms";
		break;
	case 'public':
		roomName = "all public rooms";
		break;
	default:
		roomName = `room ${room}`;
	}
	let pipeIndex = rawResults.indexOf('|');
	if (pipeIndex < 0) pipeIndex = 0;
	rawResults = rawResults.substr(pipeIndex + 1, rawResults.length);
	if (!rawResults) {
		return `|popup|No moderator actions containing \`${searchString}\` found on ${roomName}.` +
				(searchType !== '0' ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	}
	const title = `[${room}]` + (searchString ? ` ${searchString}` : ``);
	const resultArray = rawResults.split('\n');
	let lines = resultArray.length;
	let curDate = '';
	resultArray.unshift('');
	const resultString = resultArray.map(line => {
		let time;
		let bracketIndex;
		if (line) {
			if (hideIps) line = line.replace(/\([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/g, '');
			bracketIndex = line.indexOf(']');
			if (bracketIndex < 0) return Chat.escapeHTML(line);
			time = new Date(line.slice(1, bracketIndex));
		} else {
			time = new Date();
		}
		let [date, timestamp] = Chat.toTimestamp(time, {human: true}).split(' ');
		if (date !== curDate) {
			curDate = date;
			date = `</p><p>[${date}]<br />`;
		} else {
			date = ``;
		}
		if (!line) {
			return `${date}<small>[${timestamp}] \u2190 current server time</small>`;
		}
		let parenIndex = line.indexOf(')');
		let thisRoomID = line.slice(bracketIndex + 3, parenIndex);
		if (addModlogLinks) {
			let url = Config.modloglink(timestamp, thisRoomID);
			if (url) timestamp = `<a href="${url}">${timestamp}</a>`;
		}
		return `${date}<small>[${timestamp}] (${thisRoomID})</small>${Chat.escapeHTML(line.slice(parenIndex + 1))}`;
	}).join(`<br />`);
	let preamble;
	const modlogid = room + (searchString ? '-' + Dashycode.encode(searchString) : '');
	if (searchString) {
		const searchStringDescription = (searchType === '2' ? `matching the search query \`${searchString}\`` : searchType === '1' ? `containing the string ${searchString}` : `matching the username "${searchString}"`);
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n|pagehtml|<div class="pad"><p>The last ${lines} logged action${Chat.plural(lines)} ${searchStringDescription} on ${roomName}.` +
						(searchType === '0' ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	} else {
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n|pagehtml|<div class="pad"><p>The last ${lines} line${Chat.plural(lines)} of the Moderator Log of ${roomName}.`;
	}

	let moreButton = getMoreButton(room, searchString, lines, maxLines);
	return `${preamble}${resultString}${moreButton}</div>`;
}

function getModlog(connection, roomid = 'global', searchString = '', lines = 20, timed = false) {
	const startTime = Date.now();
	const targetRoom = Rooms.search(roomid);
	const user = connection.user;

	// permission checking
	if (roomid === 'all' || roomid === 'public') {
		if (!user.can('modlog')) {
			return connection.popup("Access denied");
		}
	} else {
		if (!user.can('modlog', null, targetRoom)) {
			return connection.popup("Access denied");
		}
	}

	const hideIps = !user.can('lock');
	const addModlogLinks = Config.modloglink && (user.group !== ' ' || (targetRoom && targetRoom.isPrivate !== true));

	if (searchString.length > MAX_QUERY_LENGTH) {
		connection.popup(`Your search query must be shorter than ${MAX_QUERY_LENGTH} characters.`);
		return;
	}

	let roomidList;
	// handle this here so the child process doesn't have to load rooms data
	if (roomid === 'public') {
		const isPublicRoom = (room => !(room.isPrivate || room.battle || room.isPersonal || room.id === 'global'));
		roomidList = Array.from(Rooms.rooms.values()).filter(isPublicRoom).map(room => room.id);
	} else {
		roomidList = [roomid];
	}

	PM.send(roomidList.join(','), searchString, lines).then(response => {
		connection.send(prettifyResults(response, roomid, searchString, response.charAt(0), addModlogLinks, hideIps, lines));
		if (timed) connection.popup(`The modlog query took ${Date.now() - startTime} ms to complete.`);
	});
}

exports.pages = {
	modlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		const roomid = args[0];
		const target = Dashycode.decode(args.slice(1).join('-'));

		getModlog(connection, roomid, target);
	},
};

exports.commands = {
	'!modlog': true,
	timedmodlog: 'modlog',
	modlog: function (target, room, user, connection, cmd) {
		if (!room) room = Rooms('global');
		let roomid = (room.id === 'staff' ? 'global' : room.id);

		if (target.includes(',')) {
			let targets = target.split(',');
			target = targets[1].trim();
			roomid = toId(targets[0]) || room.id;
		}

		let targetRoom = Rooms.search(roomid);
		// if a room alias was used, replace alias with actual id
		if (targetRoom) roomid = targetRoom.id;
		if (roomid.includes('-')) return this.errorReply(`Battles and groupchats (and other rooms with - in their ID) don't have individual modlogs.`);

		let lines;
		if (target.includes(LINES_SEPARATOR)) { // undocumented line specification
			const reqIndex = target.indexOf(LINES_SEPARATOR);
			const requestedLines = parseInt(target.substr(reqIndex + LINES_SEPARATOR.length, target.length));
			if (isNaN(requestedLines) || requestedLines < 1) {
				this.errorReply(`${LINES_SEPARATOR}${requestedLines} is not a valid line count.`);
				return;
			}
			lines = requestedLines;
			target = target.substr(0, reqIndex).trim(); // strip search out
		}

		if (!target && !lines) {
			lines = 20;
		}
		if (!lines) lines = DEFAULT_RESULTS_LENGTH;
		if (lines > MAX_RESULTS_LENGTH) lines = MAX_RESULTS_LENGTH;

		getModlog(connection, roomid, target, lines, cmd === 'timedmodlog');
	},
	modloghelp: function (target, room, user) {
		if (!this.runBroadcast()) return;

		this.sendReplyBox(
			`<div class='chat'>` +
			`/modlog [roomid], [search] - Searches the moderator log - defaults to the current room unless specified otherwise.<br />` +
			`- If you set [roomid] as [all], it searches for [search] on all rooms' moderator logs.<br />` +
			`- If you set [roomid] as [public], it searches for [search] in all public rooms' moderator logs, excluding battles. Requires: % @ * # & ~<br />` +
			`- Put <code style=''>"</code> around any search term to get the exact string, with symbols and spacing included, in any part of the modlog entry.  By default, it will search for userids only if quotation marks are not used.<br />` +
			`- Use <code>&&</code> include additional search terms.  Results will include lines with all the terms.<br />` +
			`- Use <code>||</code> to include additional search terms. Results will include lines with any or all of the terms.<br />` +
			`- Use <code>!</code> to exclude any search term.  Results will not include lines containing that term. <br />` +
			`- Use <code>*</code> as a wildcard within search terms for userids. It can represent several characters.<br />` +
			`- Example: <code>pi*chu || "raichu" && !ash</code> will accept lines that contain userids starting with "pi" and ending with "chu", such as "pikachu", "pichu" and "pikaandchuchu"; or any word with with the letters "raichu" inside. It will exclude lines that include the userid "ash".` +
			`</div>`
		);
	},
};
