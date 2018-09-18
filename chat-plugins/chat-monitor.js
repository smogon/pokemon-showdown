'use strict';

const FS = require('../lib/fs');

const MONITOR_FILE = 'config/chat-plugins/chat-monitor.tsv';
const WRITE_THROTTLE_TIME = 5 * 60 * 1000;

/** @type {{[k: string]: string[]}} */
let filterKeys = Chat.filterKeys = Object.assign(Chat.filterKeys, {publicwarn: ['PUBLIC', 'WARN'], warn: ['EVERYWHERE', 'WARN'], autolock: ['EVERYWHERE', 'AUTOLOCK'], namefilter: ['NAMES', 'WARN'], wordfilter: ['EVERYWHERE', 'FILTERTO']});
/** @type {{[k: string]: ([(string | RegExp), string, string?, number][])}} */
let filterWords = Chat.filterWords;

setImmediate(() => {
	for (const key in filterKeys) {
		if (!filterWords[key]) filterWords[key] = [];
	}

	/*
	 * Columns Location and Punishment use keywords. Possible values:
	 *
	 * Location: EVERYWHERE, PUBLIC, NAMES
	 * Punishment: AUTOLOCK, WARN, FILTERTO
	 */
	FS(MONITOR_FILE).readIfExists().then(data => {
		const lines = data.split('\n');
		loop: for (const line of lines) {
			if (!line || line === '\r') continue;
			let [location, word, punishment, reason, times, ...rest] = line.split('\t').map(param => param.trim());
			if (location === 'Location') continue;
			if (!(location && word && punishment)) continue;

			for (const key in filterKeys) {
				if (filterKeys[key][0] === location && filterKeys[key][1] === punishment) {
					if (punishment === 'FILTERTO') {
						const filterTo = rest[0];
						filterWords[key].push([new RegExp(word, 'g'), reason, filterTo, parseInt(times) || 0]);
						continue loop;
					} else {
						filterWords[key].push([word, reason, null, parseInt(times) || 0]);
						continue loop;
					}
				}
			}
			throw new Error(`Unrecognized [location, punishment] pair for filter word entry: ${[location, word, punishment, reason, times]}`);
		}
	});
});

/**
 * @param {string} location
 * @param {[(string | RegExp), string, string?, number]} word
 * @param {string} punishment
 */
function renderEntry(location, word, punishment) {
	const str = word[0] instanceof RegExp ? String(word[0]).slice(1, -2) : word[0];
	return `${location}\t${str}\t${punishment}\t${word[1]}\t${word[3]}${word[2] ? `\t${word[2]}` : ''}\r\n`;
}

/**
 * @param {boolean} force
 */
function saveFilters(force = false) {
	FS(MONITOR_FILE).writeUpdate(() => {
		let buf = 'Location\tWord\tPunishment\tReason\tTimes\r\n';
		for (const key in filterKeys) {
			buf += filterWords[key].map(word => renderEntry(filterKeys[key][0], word, filterKeys[key][1])).join('');
		}
		return buf;
	}, {throttle: force ? 0 : WRITE_THROTTLE_TIME});
}

/** @typedef {(this: CommandContext, target: string, room: ChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {(this: CommandContext, message: string, user: User, room: ChatRoom?, connection: Connection, targetUser: User?) => (string | boolean)} ChatFilter */
/** @typedef {(name: string, user: User) => (string)} NameFilter */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

/** @type {ChatFilter} */
let chatfilter = function (message, user, room) {
	let lcMessage = message.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	lcMessage = lcMessage.replace(/__|\*\*|``|\[\[|\]\]/g, '');

	for (let i = 0; i < filterWords.autolock.length; i++) {
		let [line, reason] = filterWords.autolock[i];
		let matched = false;
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (line.startsWith('\\b') || line.endsWith('\\b')) {
			matched = new RegExp(line).test(lcMessage);
		} else {
			matched = lcMessage.includes(line);
		}
		if (matched) {
			if (room && room.id.endsWith('staff')) return `${message} __[would be locked: ${line}]__`;
			if (user.isStaff) {
				return message;
			}
			message = message.replace(/(https?):\/\//g, '$1__:__//');
			message = message.replace(/\./g, '__.__');
			if (room) {
				Punishments.autolock(user, room, 'ChatMonitor', `Filtered phrase: ${line}`, `<${room.id}> ${user.name}: ${message}${reason ? ` __(${reason})__` : ''}`, true);
			} else {
				this.errorReply(`Please do not say '${line}'.`);
			}
			filterWords.autolock[i][3]++;
			saveFilters();
			return false;
		}
	}
	for (let i = 0; i < filterWords.warn.length; i++) {
		let [line, reason] = filterWords.warn[i];
		let matched = false;
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (line.startsWith('\\b') || line.endsWith('\\b')) {
			matched = new RegExp(line).test(lcMessage);
		} else {
			matched = lcMessage.includes(line);
		}
		if (matched) {
			if (room && room.id.endsWith('staff')) return `${message} __[would be filtered: ${line}${reason ? ` (${reason})` : ''}]__`;
			if (user.isStaff) {
				return message;
			}
			this.errorReply(`Please do not say '${line}'.`);
			filterWords.warn[i][3]++;
			saveFilters();
			return false;
		}
	}
	if ((room && room.isPrivate !== true) || !room) {
		for (let i = 0; i < filterWords.publicwarn.length; i++) {
			let [line, reason] = filterWords.publicwarn[i];
			let matched = false;
			if (typeof line !== 'string') continue; // Failsafe to appease typescript.
			if (line.startsWith('\\b') || line.endsWith('\\b')) {
				matched = new RegExp(line).test(lcMessage);
			} else {
				matched = lcMessage.includes(line);
			}
			if (matched) {
				if (room && room.id.endsWith('staff')) return `${message} __[would be filtered in public: ${line}${reason ? ` (${reason})` : ''}]__`;
				if (user.isStaff) {
					return message;
				}
				this.errorReply(`Please do not say '${line}'.`);
				filterWords.publicwarn[i][3]++;
				saveFilters();
				return false;
			}
		}
	}
	for (let line of filterWords.wordfilter) {
		const regex = line[0];
		if (typeof regex === 'string') continue;
		let matches = regex.exec(lcMessage);
		if (!matches) continue;
		for (let match of matches) {
			message.replace(match[0], line[2] || '');
			line[3]++;
			saveFilters();
		}
	}

	return message;
};

const namefilterwhitelist = new Map();
/** @type {NameFilter} */
let namefilter = function (name, user) {
	let id = toId(name);
	if (namefilterwhitelist.has(id)) return name;
	if (id === user.trackRename) return '';
	let lcName = name.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcName = lcName.replace('herapist', '').replace('grape', '').replace('scrape', '');

	for (let [line] of filterWords.autolock) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			Punishments.autolock(user, Rooms('staff'), `NameMonitor`, `inappropriate name: ${name}`, `using an inappropriate name: ${name}`, false, true);
			return '';
		}
	}
	for (let [line] of filterWords.warn) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let [line] of filterWords.publicwarn) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let line of filterWords.namefilter) {
		if (lcName.includes(String(line[0]))) {
			user.trackRename = name;
			line[3]++;
			saveFilters();
			return '';
		}
	}

	if (user.trackRename) {
		Monitor.log(`[NameMonitor] Username used: ${name} (forcerenamed from ${user.trackRename})`);
		user.trackRename = '';
	}
	return name;
};


/** @type {ChatCommands} */
let commands = {
	filters: 'filter',
	filter: {
		add: function (target, room, user) {
			if (!this.can('updateserver')) return false;

			let [list, ...rest] = target.split(',');
			list = toId(list);

			if (!list || !rest.length) return this.errorReply("Syntax: /filter add list, word, reason");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			if (filterKeys[list][1] === 'FILTERTO') {
				let [word, filterTo, ...reasonParts] = rest;
				word = word.trim();
				filterTo = filterTo.trim();
				let reason = reasonParts.join(',');
				if (!filterTo) return this.errorReply(`Syntax for word filters: /filter add ${list}, regex, filter to, reason`);

				let regex;
				try {
					regex = new RegExp(word, 'g'); // eslint-disable-line no-unused-vars
				} catch (e) {
					return this.errorReply(e.message.startsWith('Invalid regular expression: ') ? e.message : `Invalid regular expression: /${word}/: ${e.message}`);
				}

				filterWords[list].push([regex, reason, filterTo, 0]);
				this.globalModlog(`ADDFILTER`, null, `'${String(regex)} => ${filterTo}' to ${list} list by ${user.name}${reason ? ` (${reason})` : ''}`);
				saveFilters(true);
				return this.sendReply(`'${String(regex)} => ${filterTo}' was added to the ${list} list.`);
			} else {
				let [word, ...reasonParts] = rest;
				word = word.trim();
				let reason = reasonParts.join(',');
				if (filterWords[list].some(val => val[0] === word)) return this.errorReply(`${word} is already added to the ${list} list.`);
				filterWords[list].push([word, reason, null, 0]);
				this.globalModlog(`ADDFILTER`, null, `'${word}' to ${list} list by ${user.name}${reason ? ` (${reason})` : ''}`);
				saveFilters(true);
				return this.sendReply(`'${word}' was added to the ${list} list.`);
			}
		},
		remove: function (target, room, user) {
			if (!this.can('updateserver')) return false;

			let [list, ...words] = target.split(',').map(param => param.trim());
			list = toId(list);

			if (!list || !words.length) return this.errorReply("Syntax: /filter remove list, words");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			if (filterKeys[list][1] === 'FILTERTO') {
				const notFound = words.filter(val => !filterWords[list].filter(entry => String(entry[0]).slice(1, -2) === val).length);
				if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
				filterWords[list] = filterWords[list].filter(entry => !words.includes(String(entry[0]).slice(1, -2)));
				this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
				saveFilters();
				return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
			} else {
				const notFound = words.filter(val => !filterWords[list].filter(entry => entry[0] === val).length);
				if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
				filterWords[list] = filterWords[list].filter(entry => !words.includes(String(entry[0]))); // This feels wrong
				this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
				saveFilters();
				return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
			}
		},
		view: function (target, room, user) {
			if (!this.can('lock')) return false;

			let content = '';
			if (filterWords.publicwarn.length) {
				content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in public rooms:</p>${filterWords.publicwarn.map(([str, reason]) => `<abbr style="text-align:center;margin:0px;display:block;" title="${reason}">${str}</abbr>`).join('')}</td>`;
			}
			if (filterWords.warn.length) {
				content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered:</p>${filterWords.warn.map(([str, reason]) => `<abbr style="text-align:center;margin:0px;display:block;" title="${reason}">${str}</abbr>`).join('')}</td>`;
			}
			if (filterWords.autolock.length) {
				content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Weeklock:</p>${filterWords.autolock.map(([str, reason]) => `<abbr style="text-align:center;margin:0px;display:block;" title="${reason}">${str}</abbr>`).join('')}</td>`;
			}
			if (filterWords.namefilter.length) {
				content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in names:</p>${filterWords.namefilter.map(([str, reason]) => `<abbr style="text-align:center;margin:0px;display:block;" title="${reason}">${str}</abbr>`).join('')}</td>`;
			}
			if (filterWords.wordfilter.length) {
				content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in public rooms:</p>${filterWords.wordfilter.map(([str, reason, filterTo]) => `<abbr style="text-align:center;margin:0px;display:block;" title="${reason}"><code>${str}</code> => ${filterTo}</abbr>`).join('')}</td>`;
			}
			if (!content) return this.sendReplyBox("There are no filtered words.");
			return this.sendReply(`|raw|<div class="infobox infobox-limited"><table style="margin:auto;"><tr>${content}</tr></table></div>`);
		},
	},
	allowname: function (target, room, user) {
		if (!this.can('forcerename')) return false;
		target = toId(target);
		if (!target) return this.errorReply(`Syntax: /allowname username`);
		namefilterwhitelist.set(target, user.name);

		const msg = `${target} was allowed as a username by ${user.name}.`;
		const staffRoom = Rooms('staff');
		const upperStaffRoom = Rooms('upperstaff');
		if (staffRoom) staffRoom.add(msg).update();
		if (upperStaffRoom) upperStaffRoom.add(msg).update();
	},
};

exports.commands = commands;
exports.chatfilter = chatfilter;
exports.namefilter = namefilter;
