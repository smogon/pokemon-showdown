'use strict';

const FS = require('../lib/fs');

const MONITOR_FILE = 'config/chat-plugins/chat-monitor.json';

/** @type {{[k: string]: string[]}} */
let filterWords;
{
	let loadedFilterWords;
	try {
		loadedFilterWords = require(`../${MONITOR_FILE}`);
	} catch (e) {
		if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
	}
	filterWords = loadedFilterWords || {
		publicfilter: [],
		filter: [],
		autolock: [],
		namefilter: [],
	};
}

function saveFilters() {
	FS(MONITOR_FILE).writeUpdate(() => JSON.stringify(filterWords));
}

/** @typedef {(this: CommandContext, target: string, room: ChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {(this: CommandContext, message: string, user: User, room: ChatRoom?, connection: Connection, targetUser: User?) => (string | boolean)} ChatFilter */
/** @typedef {(name: string, user: User) => (string)} NameFilter */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

/** @type {ChatFilter} */
let chatfilter = function (message, user, room, connection, targetUser) {
	let lcMessage = message.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	lcMessage = lcMessage.replace(/__|\*\*|``|\[\[|\]\]/g, '');

	for (let line of filterWords.autolock) {
		let matched = false;
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
	for (let line of filterWords.filter) {
		let matched = false;
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
		for (let line of filterWords.publicfilter) {
			let matched = false;
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
		if (lcName.includes(line)) {
			Punishments.autolock(user, Rooms('staff'), `NameMonitor`, `inappropriate name: ${name}`, `using an inappropriate name: ${name}`, false, true);
			return '';
		}
	}
	for (let line of filterWords.filter) {
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let line of filterWords.publicfilter) {
		if (lcName.includes(line)) {
			user.trackRename = name;
			return '';
		}
	}
	for (let line of filterWords.namefilter) {
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

		const duplicates = words.filter(val => filterWords[list].includes(val));
		if (duplicates.length) return this.errorReply(`${duplicates.join(', ')} ${Chat.plural(duplicates, "are", "is")} already added to the ${list} list.`);
		filterWords[list] = filterWords[list].concat(words);
		this.globalModlog(`ADDFILTER`, null, `'${words.join(', ')}' to ${list} list by ${user.name}`);
		saveFilters();
		return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} added to the ${list} list.`);
	},
	removefilterword: function (target, room, user) {
		if (!this.can('updateserver')) return false;

		let [list, ...words] = target.split(',').map(param => param.trim());
		list = toId(list);

		if (!list || !words.length) return this.errorReply("Syntax: /removefilterword list, words");

		if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

		const notFound = words.filter(val => !filterWords[list].includes(val));
		if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
		filterWords[list] = filterWords[list].filter(word => !words.includes(word));
		this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
		saveFilters();
		return this.sendReply(`'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`);
	},
	viewfilters: function (target, room, user) {
		if (!this.can('lock')) return false;

		let content = '';
		if (filterWords.publicfilter.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in public rooms:</p>${filterWords.publicfilter.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.filter.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered:</p>${filterWords.filter.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.autolock.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Weeklock:</p>${filterWords.autolock.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
		}
		if (filterWords.namefilter.length) {
			content += `<td style="padding: 5px 10px;vertical-align:top;"><p style="font-weight:bold;text-align:center;">Filtered in usernames: </p>${filterWords.namefilter.map(str => `<p style="text-align:center;margin:0px;">${str}</p>`).join('')}</td>`;
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
