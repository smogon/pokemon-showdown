'use strict';

const FS = require('./../fs');
const path = require('path');
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
		// "[id]|[comma-separated list of room ids]|[searchString]|[exactSearch]|[maxLines]"
		let pipeIndex = message.indexOf('|');
		let nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let id = message.substr(0, pipeIndex);
		let rooms = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);

		pipeIndex = nextPipeIndex;
		nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let searchString = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);

		pipeIndex = nextPipeIndex;
		nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let exactSearch = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);
		let maxLines = message.substr(nextPipeIndex + 1);

		process.send(id + '|' + await this.receive(rooms, searchString, exactSearch, maxLines));
	}

	async receive(rooms, searchString, exactSearch, maxLines) {
		let result = '';
		exactSearch = exactSearch === '1';
		maxLines = Number(maxLines);
		try {
			result = '1|' + await runModlog(rooms.split(','), searchString, exactSearch, maxLines);
		} catch (err) {
			require('../crashlogger')(err, 'A modlog query', {
				rooms: rooms,
				searchString: searchString,
				exactSearch: exactSearch,
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

function getMoreButton(room, search, useExactSearch, lines, maxLines) {
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
		if (useExactSearch) search = Chat.escapeHTML(`"${search}"`);
		return `<br /><div style="float:right"><button class="button" name="send" value="/modlog ${room}, ${search} ${LINES_SEPARATOR}${newLines}" title="View more results">More results...</button></div>`;
	}
}

async function runModlog(rooms, searchString, exactSearch, maxLines) {
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
	let regexString;
	if (!searchString) {
		regexString = '.';
	} else if (exactSearch) {
		regexString = searchString.replace(/[\\.+*?()|[\]{}^$]/g, '\\$&');
	} else {
		searchString = toId(searchString);
		regexString = `[^a-zA-Z0-9]${searchString.split('').join('[^a-zA-Z0-9]*')}[^a-zA-Z0-9]`;
	}

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
	return resultData.join('\n');
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

function prettifyResults(rawResults, room, searchString, exactSearch, addModlogLinks, hideIps, maxLines) {
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
		return `|popup|No moderator actions containing ${searchString} found on ${roomName}.` +
				(exactSearch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	}
	const resultArray = rawResults.split('\n');
	let lines = resultArray.length;
	const resultString = resultArray.map(line => {
		if (hideIps) line = line.replace(/\([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/g, '');
		let bracketIndex = line.indexOf(']');
		let parenIndex = line.indexOf(')');
		if (bracketIndex < 0) return Chat.escapeHTML(line);
		const time = line.slice(1, bracketIndex);
		let timestamp = Chat.toTimestamp(new Date(time), {hour12: true});
		parenIndex = line.indexOf(')');
		let thisRoomID = line.slice(bracketIndex + 3, parenIndex);
		if (addModlogLinks) {
			let url = Config.modloglink(time, thisRoomID);
			if (url) timestamp = `<a href="${url}">${timestamp}</a>`;
		}
		return `<small>[${timestamp}] (${thisRoomID})</small>${Chat.escapeHTML(line.slice(parenIndex + 1))}`;
	}).join(`<br />`);
	let preamble;
	if (searchString) {
		const searchStringDescription = (exactSearch ? `containing the string "${searchString}"` : `matching the username "${searchString}"`);
		preamble = `|popup||wide||html|<p>The last ${lines} logged action${Chat.plural(lines)} ${searchStringDescription} on ${roomName}.` +
						(exactSearch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	} else {
		preamble = `|popup||wide||html|<p>The last ${lines} line${Chat.plural(lines)} of the Moderator Log of ${roomName}.`;
	}
	preamble +=	`</p><p><small>[${Chat.toTimestamp(new Date(), {hour12: true})}] \u2190 current server time</small></p>`;
	let moreButton = getMoreButton(room, searchString, exactSearch, lines, maxLines);
	return `${preamble}${resultString}${moreButton}`;
}

exports.commands = {
	'!modlog': true,
	timedmodlog: 'modlog',
	modlog: function (target, room, user, connection, cmd) {
		const startTime = Date.now();
		if (!room) room = Rooms('global');
		let roomId = (room.id === 'staff' ? 'global' : room.id);
		const hideIps = !user.can('lock');

		if (target.includes(',')) {
			let targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		let targetRoom = Rooms.search(roomId);
		// if a room alias was used, replace alias with actual id
		if (targetRoom) roomId = targetRoom.id;
		if (roomId.startsWith('battle-') || roomId.startsWith('groupchat-')) return this.errorReply("Battles and groupchats don't have individual modlogs.");

		// permission checking
		if (roomId === 'all' || roomId === 'public') {
			if (!this.can('modlog')) return;
		} else {
			if (!this.can('modlog', null, targetRoom)) return;
		}

		const addModlogLinks = Config.modloglink && (!hideIps || (targetRoom && targetRoom.isPrivate !== true));
		let lines = 0;
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

		let searchString = '';
		if (target) searchString = target.trim();
		if (searchString.length > MAX_QUERY_LENGTH) {
			this.errorReply(`Your search query must be shorter than ${MAX_QUERY_LENGTH} characters.`);
			return;
		}

		let exactSearch = '0';
		if (searchString.match(/^["'].+["']$/)) {
			exactSearch = '1';
			searchString = searchString.substring(1, searchString.length - 1);
		}

		let roomIdList;
		// handle this here so the child process doesn't have to load rooms data
		if (roomId === 'public') {
			const isPublicRoom = (room => !(room.isPrivate || room.battle || room.isPersonal || room.id === 'global'));
			roomIdList = Array.from(Rooms.rooms.values()).filter(isPublicRoom).map(room => room.id);
		} else {
			roomIdList = [roomId];
		}

		PM.send(roomIdList.join(','), searchString, exactSearch, lines).then(response => {
			connection.send(prettifyResults(response, roomId, searchString, exactSearch === '1', addModlogLinks, hideIps, lines));
			if (cmd === 'timedmodlog') this.sendReply(`The modlog query took ${Date.now() - startTime} ms to complete.`);
		});
	},
	modloghelp: [
		"/modlog [roomid], [search] - Searches the moderator log - defaults to the current room unless specified otherwise.",
		"If you set [roomid] as [all], it searches for [search] on all rooms' moderator logs.",
		"If you set [roomid] as [public], it searches for [search] in all public rooms' moderator logs, excluding battles. Requires: % @ * # & ~",
	],
};
