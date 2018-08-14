'use strict';

const FS = require('../lib/fs');

const MONITOR_FILE = 'config/chat-plugins/chat-monitor.tsv';

/** @type {{[k: string]: string[]}} */
let filterKeys = Chat.filterKeys = Object.assign(Chat.filterKeys, {publicwarn: ['PUBLIC', 'WARN'], warn: ['EVERYWHERE', 'WARN'], autolock: ['EVERYWHERE', 'AUTOLOCK'], namefilter: ['NAMES', 'WARN'], wordfilter: ['EVERYWHERE', 'FILTERTO']});
/** @type {{[k: string]: (string | ([RegExp, string]))[]}} */
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
			let [location, word, punishment, ...rest] = line.split('\t').map(param => param.trim());
			if (location === 'Location') continue;
			if (!(location && word && punishment)) continue;

			for (const key in filterKeys) {
				if (filterKeys[key][0] === location && filterKeys[key][1] === punishment) {
					if (punishment === 'FILTERTO') {
						const filterTo = rest[0];
						filterWords[key].push([new RegExp(word, 'g'), filterTo]);
						continue loop;
					} else {
						filterWords[key].push(word);
						continue loop;
					}
				}
			}
			throw new Error(`Unrecognized [location, punishment] pair for filter word entry: ${[location, word, punishment]}`);
		}
	});
});

/**
 * @param {string} location
 * @param {string | [RegExp, string]} word
 * @param {string} punishment
 */
function renderEntry(location, word, punishment) {
	if (Array.isArray(word)) return `${location}\t${String(word[0]).slice(1, -2)}\t${punishment}\t${word[1]}\r\n`;
	return `${location}\t${word}\t${punishment}\r\n`;
}

function saveFilters() {
	FS(MONITOR_FILE).writeUpdate(() => {
		let buf = 'Location\tWord\tPunishment\r\n';
		for (const key in filterKeys) {
			buf += filterWords[key].map(word => renderEntry(filterKeys[key][0], word, filterKeys[key][1])).join('');
		}
		return buf;
	});
}

/**
 * @param {string} key
 * @param {string} word
 */
function appendEntry(key, word) {
	FS(MONITOR_FILE).append(renderEntry(filterKeys[key][0], word, filterKeys[key][1]));
}

/** @typedef {(this: CommandContext, target: string, room: ChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {(this: CommandContext, message: string, user: User, room: ChatRoom?, connection: Connection, targetUser: User?) => (string | boolean)} ChatFilter */
/** @typedef {(name: string, user: User) => (string)} NameFilter */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

/** @type {ChatFilter} */
let chatfilter = function (message, user, room) {
	let lcMessage = message.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	lcMessage = lcMessage.replace(/__|\*\*|``|\[\[|\]\]/g, '');

	for (let line of filterWords.autolock) {
		let matched = false;
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (line.charAt(line.length - 1) === '•') {
			line = line.slice(0, -1);
			let index = lcMessage.indexOf(line);
			if (index >= 0) {
				matched = !(/[A-Za-z0-9]/.test(lcMessage.charAt(index + line.length)));
			}
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
				Punishments.autolock(user, room, 'ChatMonitor', `Filtered phrase: ${line}`, `<${room.id}> ${user.name}: ${message}`, true);
			} else {
				this.errorReply(`Please do not say '${line}'.`);
			}
			return false;
		}
	}
	for (let line of filterWords.warn) {
		let matched = false;
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (line.charAt(line.length - 1) === '•') {
			line = line.slice(0, -1);
			let index = lcMessage.indexOf(line);
			if (index >= 0) {
				matched = !(/[A-Za-z0-9]/.test(lcMessage.charAt(index + line.length)));
			}
		} else {
			matched = lcMessage.includes(line);
		}
		if (matched) {
			if (room && room.id.endsWith('staff')) return `${message} __[would be filtered: ${line}]__`;
			if (user.isStaff) {
				return message;
			}
			this.errorReply(`Please do not say '${line}'.`);
			return false;
		}
	}
	if ((room && room.isPrivate !== true) || !room) {
		for (let line of filterWords.publicwarn) {
			let matched = false;
			if (typeof line !== 'string') continue; // Failsafe to appease typescript.
			if (line.charAt(line.length - 1) === '•') {
				line = line.slice(0, -1);
				let index = lcMessage.indexOf(line);
				if (index >= 0) {
					matched = !(/[A-Za-z0-9]/.test(lcMessage.charAt(index + line.length)));
				}
			} else {
				matched = lcMessage.includes(line);
			}
			if (matched) {
				if (room && room.id.endsWith('staff')) return `${message} __[would be filtered in public: ${line}]__`;
				if (user.isStaff) {
					return message;
				}
				this.errorReply(`Please do not say '${line}'.`);
				return false;
			}
		}
	}
	for (let line of filterWords.wordfilter) {
		if (typeof line === 'string') continue; // Failsafe to appease typescript.
		message = message.replace(line[0], line[1]);
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

	for (let line of filterWords.autolock) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			Punishments.autolock(user, Rooms('staff'), `NameMonitor`, `inappropriate name: ${name}`, `using an inappropriate name: ${name}`, false, true);
			return '';
		}
	}
	for (let line of filterWords.warn) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let line of filterWords.publicwarn) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let line of filterWords.namefilter) {
		if (typeof line !== 'string') continue; // Failsafe to appease typescript.
		if (lcName.includes(line)) {
			user.trackRename = name;
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
	addfilterword: function (target, room, user) {
		if (!this.can('updateserver')) return false;

		let [list, ...words] = target.split(',').map(param => param.trim());
		list = toId(list);

		if (!list || !words.length) return this.errorReply("Syntax: /addfilterword list, words");

		if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

		if (filterKeys[list][1] === 'FILTERTO') {
			let [word, filterTo] = words;
			if (!filterTo) return this.errorReply(`Syntax for word filters: /addfilterword ${list}, regex, filter to`);

			let regex;
			try {
				regex = new RegExp(word, 'g'); // eslint-disable-line no-unused-vars
			} catch (e) {
				return this.errorReply(e.message.startsWith('Invalid regular expression: ') ? e.message : `Invalid regular expression: /${word}/: ${e.message}`);
			}

			filterWords[list].push([regex, filterTo]);
			this.globalModlog(`ADDFILTER`, null, `'${String(regex)} => ${filterTo}' to ${list} list by ${user.name}`);
			appendEntry(list, [regex, filterTo]);
			return this.sendReply(`'${String(regex)} => ${filterTo}' was added to the ${list} list.`);
		} else {
			const duplicates = words.filter(val => filterWords[list].includes(val));
			if (duplicates.length) return this.errorReply(`${duplicates.join(', ')} ${Chat.plural(duplicates, "are", "is")} already added to the ${list} list.`);
			filterWords[list] = filterWords[list].concat(words);
			this.globalModlog(`ADDFILTER`, null, `'${words.join(', ')}' to ${list} list by ${user.name}`);
			for (const word of words) {
				appendEntry(list, word);
			}
			return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} added to the ${list} list.`);
		}
	},
	removefilterword: function (target, room, user) {
		if (!this.can('updateserver')) return false;

		let [list, ...words] = target.split(',').map(param => param.trim());
		list = toId(list);

		if (!list || !words.length) return this.errorReply("Syntax: /removefilterword list, words");

		if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

		if (filterKeys[list][1] === 'FILTERTO') {
			const notFound = words.filter(val => !filterWords[list].filter(entry => String(entry[0]) === val).length);
			if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
			filterWords[list] = filterWords[list].filter(entry => words.includes(String(entry[0])));
			this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
			saveFilters();
			return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
		} else {
			const notFound = words.filter(val => !filterWords[list].includes(val));
			if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
			filterWords[list] = filterWords[list].filter(word => !words.includes(String(word))); // This feels wrong
			this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
			saveFilters();
			return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
		}
	},
	viewfilters: function (target, room, user) {
		if (!this.can('lock')) return false;

		let content = '';
		if (filterWords.publicwarn.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in public rooms:</p>${filterWords.publicwarn.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.warn.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered:</p>${filterWords.warn.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.autolock.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Weeklock:</p>${filterWords.autolock.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.namefilter.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in usernames: </p>${filterWords.namefilter.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.wordfilter.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Replaced: </p>${filterWords.wordfilter.map(entry => `<p style="text-align:center;margin:0px;"><code>${entry[0]}</code> => ${entry[1]}</p>`).join('')}</td>`;
		}
		if (!content) return this.sendReplyBox("There are no filtered words.");
		return this.sendReplyBox(`<table style="margin:auto;"><tr>${content}</tr></table>`);
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
