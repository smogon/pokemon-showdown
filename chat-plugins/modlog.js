/**
 * Modlog
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Interface for viewing and searching modlog. These run in a
 * subprocess.
 *
 * Also handles searching battle logs.
 *
 * Actually writing to modlog is handled in chat.js, rooms.js, and
 * roomlogs.js
 *
 * @license MIT
 */

'use strict';

const FS = require('./../lib/fs');
const path = require('path');
const Dashycode = require('../lib/dashycode');
const execFileSync = require('child_process').execFileSync;

const MAX_PROCESSES = 1;
const MAX_QUERY_LENGTH = 2500;
const DEFAULT_RESULTS_LENGTH = 100;
const MORE_BUTTON_INCREMENTS = [200, 400, 800, 1600, 3200];
const LINES_SEPARATOR = 'lines=';
const MAX_RESULTS_LENGTH = MORE_BUTTON_INCREMENTS[MORE_BUTTON_INCREMENTS.length - 1];
const LOG_PATH = 'logs/modlog/';
const BATTLESEARCH_LIMIT = 1;

class SortedLimitedLengthList {
	constructor(maxSize) {
		this.maxSize = maxSize;
		this.list = [];
	}

	getListClone() {
		return this.list.slice();
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

/*********************************************************
 * Modlog Functions
 *********************************************************/

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
		return `<br /><div style="text-align:center"><button class="button" name="send" value="/modlog ${room}, ${search} ${LINES_SEPARATOR}${newLines}" title="View more results">Older results<br />&#x25bc;</button></div>`;
	}
}

async function runModlog(roomidList, searchString, exactSearch, maxLines) {
	const useRipgrep = checkRipgrepAvailability() && searchString;
	let fileNameList = [];
	let checkAllRooms = false;
	for (const roomid of roomidList) {
		if (roomid === 'all') {
			checkAllRooms = true;
			const fileList = await FS(LOG_PATH).readdir();
			for (const file of fileList) {
				if (file !== 'README.md' && file !== 'modlog_global.txt') fileNameList.push(file);
			}
		} else {
			fileNameList.push(`modlog_${roomid}.txt`);
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
		regexString = `[^a-zA-Z0-9]${searchString.split('').join('[^a-zA-Z0-9]*')}([^a-zA-Z0-9]|\\z)`;
	}

	let results = new SortedLimitedLengthList(maxLines);
	if (useRipgrep) {
		// the entire directory is searched by default, no need to list every file manually
		if (checkAllRooms) fileNameList = [LOG_PATH];
		runRipgrepModlog(fileNameList, regexString, results);
	} else {
		const searchStringRegex = searchString ? new RegExp(regexString, 'i') : null;
		for (const fileName of fileNameList) {
			await checkRoomModlog(fileName, searchStringRegex, results);
		}
	}
	const resultData = results.getListClone();
	return resultData;
}

async function checkRoomModlog(path, regex, results) {
	const fileStream = await FS(path).createReadStream();
	let line;
	while ((line = await fileStream.readLine()) !== null) {
		if (!regex || regex.test(line)) {
			const insertionSuccessful = results.tryInsert(line);
			if (!insertionSuccessful) break;
		}
	}
	fileStream.destroy();
	return results;
}

function runRipgrepModlog(paths, regexString, results) {
	let stdout;
	try {
		stdout = execFileSync('rg', ['-i', '-e', regexString, '--no-filename', '--no-line-number', ...paths, '-g', '!modlog_global.txt'], {cwd: path.normalize(`${__dirname}/../`)});
	} catch (error) {
		return results;
	}
	for (const fileName of stdout.toString().split('\n').reverse()) {
		if (fileName) results.tryInsert(fileName);
	}
	return results;
}

function prettifyResults(resultArray, room, searchString, exactSearch, addModlogLinks, hideIps, maxLines) {
	if (resultArray === null) {
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
	if (!resultArray.length) {
		return `|popup|No moderator actions containing ${searchString} found on ${roomName}.` +
				(exactSearch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	}
	const title = `[${room}]` + (searchString ? ` ${searchString}` : ``);
	let lines = resultArray.length;
	let curDate = '';
	resultArray.unshift('');
	const resultString = resultArray.map(line => {
		let time;
		let bracketIndex;
		if (line) {
			if (hideIps) line = line.replace(/[([][0-9]+\.[0-9]+\.[0-9]+\.[0-9]+[)\]]/g, '');
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
			let url = Config.modloglink(time, thisRoomID);
			if (url) timestamp = `<a href="${url}">${timestamp}</a>`;
		}
		return `${date}<small>[${timestamp}] (${thisRoomID})</small>${Chat.escapeHTML(line.slice(parenIndex + 1))}`;
	}).join(`<br />`);
	let preamble;
	const modlogid = room + (searchString ? '-' + Dashycode.encode(searchString) : '');
	if (searchString) {
		const searchStringDescription = (exactSearch ? `containing the string "${searchString}"` : `matching the username "${searchString}"`);
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n|pagehtml|<div class="pad"><p>The last ${Chat.count(lines, "logged actions")} ${searchStringDescription} on ${roomName}.` +
			(exactSearch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.");
	} else {
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n|pagehtml|<div class="pad"><p>The last ${Chat.count(lines, "lines")} of the Moderator Log of ${roomName}.`;
	}
	let moreButton = getMoreButton(room, searchString, exactSearch, lines, maxLines);
	return `${preamble}${resultString}${moreButton}</div>`;
}

function getModlog(connection, roomid = 'global', searchString = '', maxLines = 20, timed = false) {
	const startTime = Date.now();
	const targetRoom = Rooms.search(roomid);
	const user = connection.user;

	// permission checking
	if (roomid === 'all' || roomid === 'public') {
		if (!user.can('modlog')) {
			return connection.popup("Access denied");
		}
	} else {
		if (!user.can('modlog', null, targetRoom) && !user.can('modlog')) {
			return connection.popup("Access denied");
		}
	}

	const hideIps = !user.can('lock');
	const addModlogLinks = Config.modloglink && (user.group !== ' ' || (targetRoom && targetRoom.isPrivate !== true));

	if (searchString.length > MAX_QUERY_LENGTH) {
		connection.popup(`Your search query must be shorter than ${MAX_QUERY_LENGTH} characters.`);
		return;
	}

	let exactSearch = false;
	if (searchString.match(/^["'].+["']$/)) {
		exactSearch = true;
		searchString = searchString.substring(1, searchString.length - 1);
	}

	let roomidList;
	// handle this here so the child process doesn't have to load rooms data
	if (roomid === 'public') {
		const isPublicRoom = (room => !(room.isPrivate || room.battle || room.isPersonal || room.id === 'global'));
		roomidList = Array.from(Rooms.rooms.values()).filter(isPublicRoom).map(room => room.id);
	} else {
		roomidList = [roomid];
	}

	PM.query({cmd: 'modlog', roomidList, searchString, exactSearch, maxLines}).then(response => {
		connection.send(prettifyResults(response, roomid, searchString, exactSearch, addModlogLinks, hideIps, maxLines));
		if (timed) connection.popup(`The modlog query took ${Date.now() - startTime} ms to complete.`);
	});
}

/*********************************************************
 * Battle Search Functions
 *********************************************************/

async function runBattleSearch(userid, tierid, turnLimit) {
	let dirs = await FS('logs/').readdir();
	dirs = dirs.filter(f => f.length === 7 && f.includes('-')).sort((aKey, bKey) => {
		const a = aKey.split('-').map(parseInt);
		const b = bKey.split('-').map(parseInt);
		if (a[0] === b[0]) {
			if (a[1] > b[1]) return -1;
			return 1;
		}
		if (a[0] > b[0]) return -1;
		return 1;
	});
	let results = {
		totalBattles: 0,
		totalWins: 0,
		totalLosses: 0,
		totalTies: 0,
	};
	let monthsSearched = 0;
	for (const month of dirs) {
		if (monthsSearched >= BATTLESEARCH_LIMIT) break;
		const out = await readBattleDir(`logs/${month}/${tierid}`, userid, turnLimit);
		for (const key in out) {
			if (!results[key]) {
				results[key] = out[key];
			} else {
				results[key] += out[key];
			}
		}
		monthsSearched++;
	}
	return results;
}

async function readBattleDir(path, userid, turnLimit) {
	const useRipgrep = checkRipgrepAvailability();
	let out = {
		totalBattles: 0,
		totalWins: 0,
		totalLosses: 0,
		totalTies: 0,
	};
	let days = [];
	try {
		days = await FS(path).readdir();
	} catch (err) {
		if (err.code === 'ENOENT') return out;
		throw err;
	}
	if (useRipgrep) {
		const regexString = `("p1":"${userid}"|"p2":"${userid}")`;
		let stdout;
		try {
			stdout = execFileSync('rg', ['-i', regexString, '--no-filename', '--no-line-number', '-tjson', path]);
		} catch (error) {
			return out;
		}
		for (const file of stdout.toString().split('\n').reverse()) {
			if (!file) continue;
			let data = JSON.parse(file);
			if (data.turns > turnLimit) continue;
			out.totalBattles++;
			if (toId(data.winner) === userid) {
				out.totalWins++;
			} else if (data.winner) {
				out.totalLosses++;
			} else {
				out.totalTies++;
			}
			const foe = toId(data.p1) === userid ? toId(data.p2) : toId(data.p1);
			if (!out[foe]) out[foe] = 0;
			out[foe]++;
		}
		return out;
	}
	for (const day of days) {
		const files = await FS(`${path}/${day}`).readdir();
		for (const file of files) {
			const json = await FS(`${path}/${day}/${file}`).readIfExists();
			const data = JSON.parse(json);
			if (toId(data.p1) !== userid && toId(data.p2) !== userid) continue;
			if (data.turns > turnLimit) continue;
			out.totalBattles++;
			if (toId(data.winner) === userid) {
				out.totalWins++;
			} else if (data.winner) {
				out.totalLosses++;
			} else {
				out.totalTies++;
			}
			const foe = toId(data.p1) === userid ? toId(data.p2) : toId(data.p1);
			if (!out[foe]) out[foe] = 0;
			out[foe]++;
		}
	}
	return out;
}

function buildResults(data, userid, tierid, turnLimit) {
	const format = Dex.getFormat(tierid);
	let buf = `>view-battlesearch-${userid}-${format.id}-${turnLimit}\n|init|html\n|title|[Battle Search][${userid}][${format.id}]\n`;
	buf += `|pagehtml|<div class="pad ladder">Results for ${Chat.escapeHTML(format.name)} where ${userid} was a player and the battle ended in ${turnLimit} or less turns:<br /><br />`;
	buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="2"><h2 style="margin: 5px auto">${userid}'s ${Chat.escapeHTML(format.name)} Battles</h1></th></tr><tr><th>Category</th><th>Number</th></tr>`;
	buf += `<tr><td>Total Battles</td><td>${data.totalBattles}</td></tr><tr><td>Total Wins</td><td>${data.totalWins}</td></tr><tr><td>Total Losses</td><td>${data.totalLosses}</td></tr><tr><td>Total Ties</td><td>${data.totalTies}</td></tr>`;
	buf += `<tr><th>Opponent</th><th>Times Battled</th></tr>`;
	for (let foe in data) {
		if (['totalBattles', 'totalWins', 'totalLosses', 'totalTies'].includes(foe)) continue;
		buf += `<tr><td>${foe}</td><td>${data[foe]}</td></tr>`;
	}
	buf += `</tbody></table></div>`;
	return buf;
}

function getBattleSearch(connection, userid, tierid, turnLimit = 1) {
	const user = connection.user;
	if (!user.can('forcewin')) return connection.popup(`Access Denied`);

	PM.query({cmd: 'battlesearch', userid, tierid, turnLimit}).then(response => {
		connection.send(buildResults(response, userid, tierid, turnLimit));
	});
}

exports.pages = {
	modlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		const roomid = args[0];
		const target = Dashycode.decode(args.slice(1).join('-'));

		getModlog(connection, roomid, target);
	},
	battlesearch(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let [userid, tierid, turnLimit] = args.map(toId);
		if (!userid || !tierid) return;
		const format = Dex.getFormat(tierid);
		if (format.exists) tierid = format.id;
		if (!turnLimit) {
			turnLimit = 1;
		} else {
			turnLimit = parseInt(turnLimit);
			if (isNaN(turnLimit)) turnLimit = 1;
		}

		getBattleSearch(connection, userid, tierid, turnLimit);
		return `|title|[Battle Search][${userid}][${format.id}]\n|pagehtml|<div class="pad ladder">Results for ${Chat.escapeHTML(format.name)} where ${userid} was a player and the battle ended in ${turnLimit} or less turns:<br /><br />Loading...`;
	},
};

exports.commands = {
	'!modlog': true,
	ml: 'modlog',
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
	modloghelp: [
		`/modlog OR /ml [roomid], [search] - Searches the moderator log - defaults to the current room unless specified otherwise.`,
		`If you set [roomid] as [all], it searches for [search] on all rooms' moderator logs.`,
		`If you set [roomid] as [public], it searches for [search] in all public rooms' moderator logs, excluding battles. Requires: % @ * # & ~`,
	],

	battlesearch: function (target, room, user, connection) {
		if (!target.trim()) return this.parse('/help battlesearch');

		let [userid, tierid, turnLimit] = target.split(',').map(x => { return toId(x); });
		if (!userid || !tierid) return this.parse('/help battlesearch');
		const format = Dex.getFormat(tierid);
		if (format.exists) tierid = format.id;
		if (!turnLimit) {
			turnLimit = 1;
		} else {
			turnLimit = parseInt(turnLimit);
			if (isNaN(turnLimit) || turnLimit < 1) turnLimit = 1;
		}

		getBattleSearch(connection, userid, tierid, turnLimit);
		return user.send(`>view-battlesearch-${userid}-${format.id}-${turnLimit}\n|init|html\n|title|[Battle Search][${userid}][${format.id}]\n|pagehtml|<div class="pad ladder">Results for ${Chat.escapeHTML(format.name)} where ${userid} was a player and the battle ended in ${turnLimit} or less turns:<br /><br />Loading...`);
	},
	battlesearchhelp: ['/battlesearch [user], [tier], (turn limit) - Searches a users rated battle history and returns information on battles that ended in (turn limit or 1) turns or less. Requires &, ~'],
};

/*********************************************************
 * Process manager
 *********************************************************/

const QueryProcessManager = require('./../lib/process-manager').QueryProcessManager;

const PM = new QueryProcessManager(module, async data => {
	switch (data.cmd) {
	case 'modlog':
		const {roomidList, searchString, exactSearch, maxLines} = data;
		try {
			return await runModlog(roomidList, searchString, exactSearch, maxLines);
		} catch (err) {
			require('../lib/crashlogger')(err, 'A modlog query', {
				roomidList,
				searchString,
				exactSearch,
				maxLines,
			});
		}
		break;
	case 'battlesearch':
		const {userid, tierid, turnLimit} = data;
		try {
			return await runBattleSearch(userid, tierid, turnLimit);
		} catch (err) {
			require('../lib/crashlogger')(err, 'A battle search query', {
				userid,
				tierid,
				turnLimit,
			});
		}
		break;
	}
	return null;
});

if (!PM.isParentProcess) {
	// This is a child process!
	global.Config = require('../config/config');
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			require('../lib/crashlogger')(err, 'A modlog child process');
		}
	});
	global.Dex = require('../sim/dex');
	global.toId = Dex.getId;

	require('../lib/repl').start('modlog', cmd => eval(cmd));
} else {
	PM.spawn(MAX_PROCESSES);
}

exports.PM = PM;
