'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const MONITOR_FILE = 'config/chat-plugins/chat-monitor.tsv';
const WRITE_THROTTLE_TIME = 5 * 60 * 1000;

/** @type {{[k: string]: [(string | RegExp), string, string?, number][]}} */
let filterWords = Chat.filterWords;

/**
 * @param {string} location
 * @param {[(string | RegExp), string, string?, number]} word
 * @param {string} punishment
 */
function renderEntry(location, word, punishment) {
	let str = word[0];
	if (word[0] instanceof RegExp) {
		if (punishment === 'SHORTENER') {
			str = String(word[0]).slice(3, -3).replace(/\\./g, '.');
		} else {
			str = String(word[0]).slice(1, -3);
		}
	}
	return `${location}\t${str}\t${punishment}\t${word[1]}\t${word[3]}${word[2] ? `\t${word[2]}` : ''}\r\n`;
}

/**
 * @param {boolean} force
 */
function saveFilters(force = false) {
	FS(MONITOR_FILE).writeUpdate(() => {
		let buf = 'Location\tWord\tPunishment\tReason\tTimes\r\n';
		for (const key in Chat.monitors) {
			buf += filterWords[key].map(word => renderEntry(Chat.monitors[key].location, word, Chat.monitors[key].punishment)).join('');
		}
		return buf;
	}, {throttle: force ? 0 : WRITE_THROTTLE_TIME});
}

// Register the chat monitors used

Chat.registerMonitor('autolock', {
	location: 'EVERYWHERE',
	punishment: 'AUTOLOCK',
	label: 'Autolock',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [word, reason] = line;
		let matched = false;
		if (typeof word !== 'string') throw new Error(`autolock filters should only have strings`);
		if (word.startsWith('\\b') || word.endsWith('\\b')) {
			matched = new RegExp(word).test(lcMessage);
		} else {
			matched = lcMessage.includes(word);
		}
		if (matched) {
			if (isStaff) return `${message} __[would be locked: ${word}${reason ? ` (${reason})` : ''}]__`;
			message = message.replace(/(https?):\/\//g, '$1__:__//');
			message = message.replace(/\./g, '__.__');
			if (room) {
				Punishments.autolock(user, room, 'ChatMonitor', `Filtered phrase: ${word}`, `<${room.id}> ${user.name}: ${message}${reason ? ` __(${reason})__` : ''}`, true);
			} else {
				this.errorReply(`Please do not say '${word.replace(/\\b/g, '')}'.`);
			}
			return false;
		}
	},
});

Chat.registerMonitor('publicwarn', {
	location: 'PUBLIC',
	punishment: 'WARN',
	label: 'Filtered in public',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [word, reason] = line;
		let matched = false;
		if (typeof word !== 'string') throw new Error(`publicwarn filters should only have strings`);
		if (word.startsWith('\\b') || word.endsWith('\\b')) {
			matched = new RegExp(word).test(lcMessage);
		} else {
			matched = lcMessage.includes(word);
		}
		if (matched) {
			if (isStaff) return `${message} __[would be filtered in public: ${word}${reason ? ` (${reason})` : ''}]__`;
			this.errorReply(`Please do not say '${word.replace(/\\b/g, '')}'.`);
			return false;
		}
	},
});

Chat.registerMonitor('warn', {
	location: 'EVERYWHERE',
	punishment: 'WARN',
	label: 'Filtered',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [word, reason] = line;
		let matched = false;
		if (typeof word !== 'string') throw new Error(`warn filters should only have strings`);
		if (word.startsWith('\\b') || word.endsWith('\\b')) {
			matched = new RegExp(word).test(lcMessage);
		} else {
			matched = lcMessage.includes(word);
		}
		if (matched) {
			if (isStaff) return `${message} __[would be filtered: ${word}${reason ? ` (${reason})` : ''}]__`;
			this.errorReply(`Please do not say '${word.replace(/\\b/g, '')}'.`);
			return false;
		}
	},
});

Chat.registerMonitor('wordfilter', {
	location: 'EVERYWHERE',
	punishment: 'FILTERTO',
	label: 'Filtered to a different phrase',
	condition: 'notStaff',
	monitor(line, room, user, message, lcMessage, isStaff) {
		const [regex] = line;
		if (typeof regex === 'string') throw new Error(`wordfilter filters should not have strings`);
		let match = regex.exec(message);
		while (match) {
			let filtered = line[2] || '';
			if (match[0] === match[0].toUpperCase()) filtered = filtered.toUpperCase();
			if (match[0][0] === match[0][0].toUpperCase()) filtered = `${filtered ? filtered[0].toUpperCase() : ''}${filtered.slice(1)}`;
			message = message.replace(match[0], filtered);
			match = regex.exec(message);
		}
		return message;
	},
});

Chat.registerMonitor('namefilter', {
	location: 'NAMES',
	punishment: 'WARN',
	label: 'Filtered in names',
});

Chat.registerMonitor('shorteners', {
	location: 'EVERYWHERE',
	punishment: 'SHORTENER',
	label: 'URL Shorteners',
	condition: 'notTrusted',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex] = line;
		if (typeof regex === 'string') throw new Error(`shortener filters should not have strings`);
		if (regex.test(lcMessage)) {
			if (isStaff) return `${message} __[shortener: ${String(regex).slice(3, -3).replace('\\.', '.')}]__`;
			this.errorReply(`Please do not use URL shorteners like '${String(regex).slice(3, -3).replace('\\.', '.')}'.`);
			return false;
		}
	},
});

/*
 * Columns Location and Punishment use keywords. Possible values:
 *
 * Location: EVERYWHERE, PUBLIC, NAMES
 * Punishment: AUTOLOCK, WARN, FILTERTO, SHORTENER
 */
FS(MONITOR_FILE).readIfExists().then(data => {
	const lines = data.split('\n');
	loop: for (const line of lines) {
		if (!line || line === '\r') continue;
		let [location, word, punishment, reason, times, ...rest] = line.split('\t').map(param => param.trim());
		if (location === 'Location') continue;
		if (!(location && word && punishment)) continue;

		for (const key in Chat.monitors) {
			if (Chat.monitors[key].location === location && Chat.monitors[key].punishment === punishment) {
				if (punishment === 'FILTERTO') {
					const filterTo = rest[0];
					filterWords[key].push([new RegExp(word, 'ig'), reason, filterTo, parseInt(times) || 0]);
				} else if (punishment === 'SHORTENER') {
					const regex = new RegExp(`\\b${word.replace(/\\/g, '\\\\').replace(/\./g, '\\.')}\\b`);
					filterWords[key].push([regex, reason, null, parseInt(times) || 0]);
				} else {
					filterWords[key].push([word, reason, null, parseInt(times) || 0]);
				}
				continue loop;
			}
		}
		throw new Error(`Unrecognized [location, punishment] pair for filter word entry: ${[location, word, punishment, reason, times]}`);
	}
});

/** @type {ChatFilter} */
let chatfilter = function (message, user, room) {
	let lcMessage = message.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	lcMessage = lcMessage.replace(/__|\*\*|``|\[\[|\]\]/g, '');

	const isStaffRoom = room && ((room.chatRoomData && room.id.endsWith('staff')) || room.id.startsWith('help-'));
	const isStaff = isStaffRoom || user.isStaff || !!(this.pmTarget && this.pmTarget.isStaff);

	for (const list in Chat.monitors) {
		const {location, condition, monitor} = Chat.monitors[list];
		if (!monitor) continue;
		if (location === 'PUBLIC' && room && room.isPrivate === true) continue;

		switch (condition) {
		case 'notTrusted':
			if (user.trusted && !isStaffRoom) continue;
			break;
		case 'notStaff':
			if (isStaffRoom) continue;
			break;
		}

		for (const line of Chat.filterWords[list]) {
			const ret = monitor.call(this, line, room, user, message, lcMessage, isStaff);
			if (ret && ret !== message) {
				line[3]++;
				saveFilters();
			}
			if (typeof ret === 'string') {
				message = ret;
			} else if (ret === false) {
				return false;
			}
		}
	}


	return message;
};

/** @type {NameFilter} */
let namefilter = function (name, user) {
	let id = toId(name);
	if (Chat.namefilterwhitelist.has(id)) return name;
	if (id === toId(user.trackRename)) return '';
	let lcName = name.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcName = lcName.replace('herapist', '').replace('grape', '').replace('scrape', '');

	for (const list in filterWords) {
		for (let line of filterWords[list]) {
			const word = line[0];

			let matched;
			if (typeof word !== 'string') {
				matched = word.test(lcName);
			} else if (word.startsWith('\\b') || word.endsWith('\\b')) {
				matched = new RegExp(word).test(lcName);
			} else {
				matched = lcName.includes(word);
			}
			if (matched) {
				if (Chat.monitors[list].punishment === 'AUTOLOCK') {
					Punishments.autolock(user, Rooms('staff'), `NameMonitor`, `inappropriate name: ${name}`, `using an inappropriate name: ${name} (from ${user.name})`, false, name);
				} else {
					user.trackRename = name;
				}
				line[3]++;
				saveFilters();
				return '';
			}
		}
	}

	if (user.trackRename) {
		Monitor.log(`[NameMonitor] Username used: ${name} (forcerenamed from ${user.trackRename})`);
		user.trackRename = '';
	}
	return name;
};

/** @type {NameFilter} */
let nicknamefilter = function (name, user) {
	let lcName = name.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcName = lcName.replace('herapist', '').replace('grape', '').replace('scrape', '');

	for (const list in filterWords) {
		for (let line of filterWords[list]) {
			const word = line[0];

			let matched;
			if (typeof word !== 'string') {
				matched = word.test(lcName);
			} else if (word.startsWith('\\b') || word.endsWith('\\b')) {
				matched = new RegExp(word).test(lcName);
			} else {
				matched = lcName.includes(word);
			}
			if (matched) {
				if (Chat.monitors[list].punishment === 'AUTOLOCK') {
					Punishments.autolock(user, Rooms('staff'), `NameMonitor`, `inappropriate Pokémon nickname: ${name}`, `${user.name} - using an inappropriate Pokémon nickname: ${name}`, true);
				}
				line[3]++;
				saveFilters();
				return '';
			}
		}
	}

	return name;
};

/** @type {PageTable} */
const pages = {
	filters(query, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		this.title = 'Filters';
		let buf = `<div class="pad ladder"><h2>Filters</h2>`;
		if (!this.can('lock')) return;
		let content = ``;
		for (const key in Chat.monitors) {
			content += `<tr><th colspan="2"><h3>${Chat.monitors[key].label} <span style="font-size:8pt;">[${key}]</span></h3></tr></th>`;
			if (filterWords[key].length) {
				content += filterWords[key].map(([str, reason, filterTo, hits]) => {
					let entry = '';
					if (filterTo) {
						entry = `<abbr title="${reason}"><code>${str}</code></abbr> &rArr; ${filterTo}`;
					} else {
						if (Chat.monitors[key].punishment === 'SHORTENER') str = String(str).slice(3, -3).replace(/\\./g, '.');
						entry = `<abbr title="${reason}">${str}</abbr>`;
					}
					return `<tr><td>${entry}</td><td>${hits}</td></tr>`;
				}).join('');
			}
		}

		if (Chat.namefilterwhitelist.size) {
			content += `<tr><th colspan="2"><h3>Whitelisted names</h3></tr></th>`;
			for (const [val] of Chat.namefilterwhitelist) {
				content += `<tr><td>${val}</td></tr>`;
			}
		}
		if (!content) {
			buf += `<p>There are no filtered words.</p>`;
		} else {
			buf += `<table>${content}</table>`;
		}
		buf += `</div>`;
		return buf;
	},
};
exports.pages = pages;

/** @type {ChatCommands} */
let commands = {
	filters: 'filter',
	filter: {
		add(target, room, user) {
			if (!this.can('updateserver')) return false;

			let [list, ...rest] = target.split(',');
			list = toId(list);

			if (!list || !rest.length) return this.errorReply("Syntax: /filter add list, word, reason");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			if (Chat.monitors[list].punishment === 'FILTERTO') {
				let [word, filterTo, ...reasonParts] = rest;
				if (!filterTo) return this.errorReply(`Syntax for word filters: /filter add ${list}, regex, filter to, reason`);
				word = word.trim();
				filterTo = filterTo.trim();
				let reason = reasonParts.join(',').trim();

				let regex;
				try {
					regex = new RegExp(word, 'ig'); // eslint-disable-line no-unused-vars
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
				let reason = reasonParts.join(',').trim();
				if (Chat.monitors[list].punishment === 'SHORTENER') {
					if (filterWords[list].some(val => String(val[0]).slice(3, -3).replace(/\\./g, '.') === word)) return this.errorReply(`${word} is already added to the ${list} list.`);
					const regex = new RegExp(`\\b${word.replace(/\\/g, '\\\\').replace(/\./g, '\\.')}\\b`);
					filterWords[list].push([regex, reason, null, 0]);
				} else {
					if (filterWords[list].some(val => val[0] === word)) return this.errorReply(`${word} is already added to the ${list} list.`);
					filterWords[list].push([word, reason, null, 0]);
				}
				this.globalModlog(`ADDFILTER`, null, `'${word}' to ${list} list by ${user.name}${reason ? ` (${reason})` : ''}`);
				saveFilters(true);
				return this.sendReply(`'${word}' was added to the ${list} list.`);
			}
		},
		remove(target, room, user) {
			if (!this.can('updateserver')) return false;

			let [list, ...words] = target.split(',').map(param => param.trim());
			list = toId(list);

			if (!list || !words.length) return this.errorReply("Syntax: /filter remove list, words");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			if (Chat.monitors[list].punishment === 'FILTERTO') {
				const notFound = words.filter(val => !filterWords[list].filter(entry => String(entry[0]).slice(1, -3) === val).length);
				if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
				filterWords[list] = filterWords[list].filter(entry => !words.includes(String(entry[0]).slice(1, -3)));
				this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
				saveFilters(true);
				return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
			} else {
				const notFound = words.filter(val => !filterWords[list].filter(entry => entry[0] === val).length);
				if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
				filterWords[list] = filterWords[list].filter(entry => !words.includes(String(entry[0]))); // This feels wrong
				this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
				saveFilters(true);
				return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
			}
		},
		'': 'view',
		list: 'view',
		view(target, room, user) {
			this.parse(`/join view-filters`);
		},
		help(target, room, user) {
			this.parse(`/help filter`);
		},
	},
	filterhelp: [
		`- /filter add list, word, reason - Adds a word to the given filter list. Requires: ~`,
		`- /filter remove list, words - Removes words from the given filter list. Requires: ~`,
		`- /filter view - Opens the list of filtered words. Requires: % @ & ~`,
	],
	allowname(target, room, user) {
		if (!this.can('forcerename')) return false;
		target = toId(target);
		if (!target) return this.errorReply(`Syntax: /allowname username`);
		Chat.namefilterwhitelist.set(target, user.name);

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
exports.nicknamefilter = nicknamefilter;
