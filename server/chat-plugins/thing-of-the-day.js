'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const MINUTE = 60 * 1000;
const ROOMIDS = ['thestudio', 'jubilifetvfilms', 'youtube', 'thelibrary', 'prowrestling'];

/** @type {{[k: string]: ChatRoom}} */
const rooms = {};

for (const roomid of ROOMIDS) {
	rooms[roomid] = /** @type {ChatRoom} */ (Rooms.get(roomid));
}

const AOTDS_FILE = 'config/chat-plugins/thestudio.tsv';
const FOTDS_FILE = 'config/chat-plugins/tvbf-films.tsv';
const SOTDS_FILE = 'config/chat-plugins/tvbf-shows.tsv';
const COTDS_FILE = 'config/chat-plugins/youtube-channels.tsv';
const BOTWS_FILE = 'config/chat-plugins/thelibrary.tsv';
const MOTWS_FILE = 'config/chat-plugins/prowrestling-matches.tsv';
const PRENOMS_FILE = 'config/chat-plugins/otd-prenoms.json';

/** @type {{[k: string]: [string, AnyObject][]}} */
let prenoms = {};
try {
	prenoms = require(`../../${PRENOMS_FILE}`);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}
if (!prenoms || typeof prenoms !== 'object') prenoms = {};

function savePrenoms() {
	FS(PRENOMS_FILE).write(JSON.stringify(prenoms));
}

/**
 * @param {string} nomination
 *
 * toId would return '' for foreign/sadistic nominations
 */
function toNominationId(nomination) {
	return nomination.toLowerCase().replace(/\s/g, '').replace(/\b&\b/g, '');
}

class OtdHandler {
	/**
	 * @param {string} id
	 * @param {string} name
	 * @param {ChatRoom} room
	 * @param {string} filename
	 * @param {string[]} keys
	 * @param {string[]} keyLabels
	 * @param {boolean} week
	 */
	constructor(id, name, room, filename, keys, keyLabels, week = false) {
		this.id = id;
		this.name = name;
		this.room = room;

		/** @type {Map<string, AnyObject>} */
		this.nominations = new Map(prenoms[id]);
		this.removedNominations = new Map();

		this.voting = false;
		this.timer = null;

		this.file = FS(filename);

		this.keys = keys;
		this.keyLabels = keyLabels;
		this.timeLabel = week ? 'Week' : 'Day';

		/** @type {AnyObject[]} */
		this.winners = [];

		this.file.read().then(content => {
			const data = ('' + content).split("\n");
			for (const arg of data) {
				if (!arg || arg === '\r') continue;
				if (arg.startsWith(`${this.keyLabels[0]}\t`)) continue;
				/** @type {AnyObject} */
				const entry = {};
				let vals = arg.trim().split("\t");
				for (let i = 0; i < vals.length; i++) {
					entry[this.keys[i]] = vals[i];
				}
				entry.time = Number(entry.time) || 0;
				this.winners.push(entry);
			}
		}).catch(err => {
			if (err.code !== 'ENOENT') throw err;
		});
	}

	startVote() {
		this.voting = true;
		this.timer = setTimeout(() => this.rollWinner(), 20 * MINUTE);
		this.display();
	}

	finish() {
		this.voting = false;
		this.nominations = new Map();
		this.removedNominations = new Map();
		delete prenoms[this.id];
		savePrenoms();
		if (this.timer) clearTimeout(this.timer);
	}

	/**
	 * @param {User} user
	 * @param {string} nomination
	 */
	addNomination(user, nomination) {
		const id = toNominationId(nomination);

		if (this.winners.slice(this.room === rooms.jubilifetvfilms ? -15 : -30).some(entry => toNominationId(entry[this.keys[0]]) === id)) return user.sendTo(this.room, `This ${this.name.toLowerCase()} has already been ${this.id} in the past month.`);

		for (const value of this.removedNominations.values()) {
			if (toId(user) in value.userids || user.latestIp in value.ips) return user.sendTo(this.room, `Since your nomination has been removed by staff, you cannot submit another ${this.name.toLowerCase()} until the next round.`);
		}

		const prevNom = this.nominations.get(id);
		if (prevNom) {
			if (!(toId(user) in prevNom.userids || user.latestIp in prevNom.ips)) {
				return user.sendTo(this.room, `This ${this.name.toLowerCase()} has already been nominated.`);
			}
		}

		for (const [key, value] of this.nominations) {
			if (toId(user) in value.userids || user.latestIp in value.ips) {
				user.sendTo(this.room, `Your previous vote for ${value.nomination} will be removed.`);
				this.nominations.delete(key);
				if (prenoms[this.id]) {
					let idx = prenoms[this.id].findIndex(val => val[0] === key);
					if (idx > -1) {
						prenoms[this.id].splice(idx, 1);
						savePrenoms();
					}
				}
			}
		}

		/** @type {{[k: string]: string}} */
		let obj = {};
		obj[user.userid] = user.name;

		let nomObj = {nomination: nomination, name: user.name, userids: Object.assign(obj, user.prevNames), ips: Object.assign({}, user.ips)};

		this.nominations.set(id, nomObj);

		if (!prenoms[this.id]) prenoms[this.id] = [];
		prenoms[this.id].push([id, nomObj]);
		savePrenoms();

		user.sendTo(this.room, `Your nomination for ${nomination} was successfully submitted.`);

		if (this.voting) this.display();
	}

	generateNomWindow() {
		let buffer = '';

		if (this.voting) {
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for ${this.name} of the ${this.timeLabel} are in progress! Use <code>/${this.id} nom</code> to nominate a${['A', 'E', 'I', 'O', 'U'].includes(this.name[0]) ? 'n' : ''} ${this.name.toLowerCase()}!</p>`;
			if (this.nominations.size) buffer += `<span style="font-weight:bold;">Nominations:</span>`;
		} else {
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:10pt;">Pre-noms for ${this.name} of the ${this.timeLabel}:</p>`;
		}

		/** @type {string[]} */
		const entries = [];

		for (const value of this.nominations.values()) {
			entries.push(`<li><b>${value.nomination}</b> <i>(Submitted by ${value.name})</i></li>`);
		}

		if (entries.length > 20) {
			buffer += `<table><tr><td><ul>${entries.slice(0, Math.ceil(entries.length / 2)).join('')}</ul></td><td><ul>${entries.slice(Math.ceil(entries.length / 2)).join('')}</ul></td></tr></table>`;
		} else {
			buffer += `<ul>${entries.join('')}</ul>`;
		}

		buffer += `</div>`;

		return buffer;
	}

	display() {
		this.room.add(`|uhtml|otd|${this.generateNomWindow()}`);
	}

	/**
	 * @param {Connection} connection
	 */
	displayTo(connection) {
		connection.sendTo(this.room, `|uhtml|otd|${this.generateNomWindow()}`);
	}

	rollWinner() {
		let keys = [...this.nominations.keys()];
		if (!keys.length) return false;

		let winner = this.nominations.get(keys[Math.floor(Math.random() * keys.length)]);
		if (!winner) return false; // Should never happen but shuts typescript up.
		this.appendWinner(winner.nomination, winner.name);

		const names = [...this.nominations.values()].map(obj => obj.name);

		let columns = names.length > 27 ? 4 : names.length > 18 ? 3 : names.length > 9 ? 2 : 1;
		let content = '';
		for (let i = 0; i < columns; i++) {
			content += `<td>${names.slice(Math.ceil((i / columns) * names.length), Math.ceil(((i + 1) / columns) * names.length)).join('<br/>')}</td>`;
		}
		const namesHTML = `<table><tr>${content}</tr></table></p></div>`;

		this.room.add(Chat.html `|uhtml|otd|<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for ${this.name} of the ${this.timeLabel} are over!</p><p style="tex-align:center;font-size:10pt;">Out of ${keys.length} nominations, we randomly selected <strong>${winner.nomination}</strong> as the winner! (Nomination by ${winner.name})</p><p style="font-weight:bold;">Thanks to today's participants:` + namesHTML);
		this.room.update();

		this.finish();
		return true;
	}

	/**
	 * @param {string} name
	 */
	removeNomination(name) {
		name = toId(name);

		let success = false;
		for (const [key, value] of this.nominations) {
			if (name in value.userids) {
				this.removedNominations.set(key, value);
				this.nominations.delete(key);
				if (prenoms[this.id]) {
					let idx = prenoms[this.id].findIndex(val => val[0] === key);
					if (idx > -1) {
						prenoms[this.id].splice(idx, 1);
						savePrenoms();
					}
				}
				success = true;
			}
		}

		if (this.voting) this.display();
		return success;
	}

	/**
	 * @param {string} winner
	 * @param {string} user
	 */
	forceWinner(winner, user) {
		this.appendWinner(winner, user);
		this.finish();
	}

	/**
	 * @param {string} nomination
	 * @param {string} user
	 */
	appendWinner(nomination, user) {
		/** @type {AnyObject} */
		const entry = {time: Date.now(), nominator: user};
		entry[this.keys[0]] = nomination;
		this.winners.push(entry);
		this.saveWinners();
	}

	/**
	 * @param {{[k: string]: string}} properties
	 */
	setWinnerProperty(properties) {
		if (!this.winners.length) return;
		for (let i in properties) {
			this.winners[this.winners.length - 1][i] = properties[i];
		}
		this.saveWinners();
	}

	saveWinners() {
		let buf = `${this.keyLabels.join('\t')}\n`;
		for (const winner of this.winners) {
			let strings = [];

			for (const key of this.keys) {
				strings.push(winner[key] || '');
			}

			buf += `${strings.join('\t')}\n`;
		}

		this.file.write(buf);
	}

	async generateWinnerDisplay() {
		if (!this.winners.length) return false;
		let winner = this.winners[this.winners.length - 1];

		let output = Chat.html `<div class="broadcast-blue" style="text-align:center;"><p><span style="font-weight:bold;font-size:11pt">The ${this.name} of the ${this.timeLabel} is ${winner[this.keys[0]]}${winner.author ? ` by ${winner.author}` : ''}.</span>`;
		if (winner.quote) output += Chat.html `<br/><span style="font-style:italic;">"${winner.quote}"</span>`;
		if (winner.tagline) output += Chat.html `<br/>${winner.tagline}`;
		output += `</p><table style="margin:auto;"><tr>`;
		if (winner.image) {
			const [width, height] = await Chat.fitImage(winner.image, 100, 100);
			output += Chat.html `<td><img src="${winner.image}" width=${width} height=${height}></td>`;
		}
		output += `<td style="text-align:right;margin:5px;">`;
		if (winner.event) output += Chat.html `<b>Event:</b> ${winner.event}<br/>`;
		if (winner.song) {
			output += `<b>Song:</b> `;
			if (winner.link) {
				output += Chat.html `<a href="${winner.link}">${winner.song}</a>`;
			} else {
				output += Chat.escapeHTML(winner.song);
			}
			output += `<br/>`;
		} else if (winner.link) {
			output += Chat.html `<b>Link:</b> <a href="${winner.link}">${winner.link}</a><br/>`;
		}
		output += Chat.html `Nominated by ${winner.nominator}.`;
		output += `</td></tr></table></div>`;

		return output;
	}

	/**
	 * @param {PageContext} context
	 */
	generateWinnerList(context) {
		context.title = `${this.id.toUpperCase()} Winners`;
		let buf = `<div class="pad ladder"><h2>${this.name} of the ${this.timeLabel} Winners</h2>`;

		// Only use specific fields for displaying in winners list.
		/** @type {string[]} */
		const columns = [];
		const labels = [];

		for (let i = 0; i < this.keys.length; i++) {
			if (i === 0 || ['song', 'event', 'time', 'link', 'tagline'].includes(this.keys[i]) && !(this.keys[i] === 'link' && this.keys.includes('song'))) {
				columns.push(this.keys[i]);
				labels.push(this.keyLabels[i]);
			}
		}

		let content = ``;

		content += `<tr>${labels.map(label => `<th><h3>${label}</h3></th>`).join('')}</tr>`;
		for (let i = this.winners.length - 1; i >= 0; i--) {
			const entry = columns.map(col => {
				let val = this.winners[i][col];
				if (!val) return '';
				switch (col) {
				case 'time':
					let date = new Date(this.winners[i].time);

					/** @param {number} num */
					const pad = num => num < 10 ? '0' + num : num;

					return Chat.html `${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}`;
				case 'song':
					if (!this.winners[i].link) return val;
					// falls through
				case 'link':
					return `<a href="${this.winners[i].link}">${val}</a>`;
				case 'book':
					val = `${val}${this.winners[i].author ? ` by ${this.winners[i].author}` : ''}`;
					// falls through
				case columns[0]:
					return `${Chat.escapeHTML(val)}${this.winners[i].nominator ? Chat.html `<br/><span style="font-style:italic;font-size:8pt;">nominated by ${this.winners[i].nominator}</span>` : ''}`;
				default:
					return Chat.escapeHTML(val);
				}
			});
			content += `<tr>${entry.map(val => `<td style="max-width:${600 / columns.length}px;word-wrap:break-word;">${val}</td>`).join('')}</tr>`;
		}
		if (!content) {
			buf += `<p>There have been no ${this.id} winners.</p>`;
		} else {
			buf += `<table>${content}</table>`;
		}
		buf += `</div>`;
		return buf;
	}
}

const aotd = new OtdHandler('aotd', 'Artist', rooms.thestudio, AOTDS_FILE, ['artist', 'nominator', 'quote', 'song', 'link', 'image', 'time'], ['Artist', 'Nominator', 'Quote', 'Song', 'Link', 'Image', 'Timestamp']);
const fotd = new OtdHandler('fotd', 'Film', rooms.jubilifetvfilms, FOTDS_FILE, ['film', 'nominator', 'quote', 'link', 'image', 'time'], ['Film', 'Nominator', 'Quote', 'Link', 'Image', 'Timestamp']);
const sotd = new OtdHandler('sotd', 'Show', rooms.jubilifetvfilms, SOTDS_FILE, ['show', 'nominator', 'quote', 'link', 'image', 'time'], ['Show', 'Nominator', 'Quote', 'Link', 'Image', 'Timestamp']);
const cotd = new OtdHandler('cotd', 'Channel', rooms.youtube, COTDS_FILE, ['channel', 'nominator', 'link', 'tagline', 'image', 'time'], ['Show', 'Nominator', 'Link', 'Tagline', 'Image', 'Timestamp']);
const botw = new OtdHandler('botw', 'Book', rooms.thelibrary, BOTWS_FILE, ['book', 'nominator', 'link', 'quote', 'author', 'image', 'time'], ['Book', 'Nominator', 'Link', 'Quote', 'Author', 'Image', 'Timestamp'], true);
const motw = new OtdHandler('motw', 'Match', rooms.prowrestling, MOTWS_FILE, ['match', 'nominator', 'link', 'tagline', 'event', 'image', 'time'], ['Match', 'Nominator', 'Link', 'Tagline', 'Event', 'Image', 'Timestamp'], true);

/**
 * @param {string} message
 */
function selectHandler(message) {
	let id = toId(message.substring(1, 5));
	switch (id) {
	case 'aotd':
		return aotd;
	case 'fotd':
		return fotd;
	case 'sotd':
		return sotd;
	case 'cotd':
		return cotd;
	case 'botw':
		return botw;
	case 'motw':
		return motw;
	default:
		throw new Error("Invalid type for otd handler.");
	}
}

/** @type {ChatCommands} */
let commands = {
	start(target, room, user, connection, cmd) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (handler.voting) return this.errorReply(`The nomination for the ${handler.name} of the ${handler.timeLabel} nomination is already in progress.`);
		handler.startVote();

		this.privateModAction(`(${user.name} has started nominations for the ${handler.name} of the ${handler.timeLabel}.)`);
		this.modlog(`${handler.id.toUpperCase()} START`, null);
	},
	starthelp: [`/-otd start - Starts nominations for the Thing of the Day. Requires: % @ # & ~`],

	end(target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (!handler.voting) return this.errorReply(`There is no ${handler.name} of the ${handler.timeLabel} nomination in progress.`);

		if (!handler.nominations.size) return this.errorReply(`Can't select the ${handler.name} of the ${handler.timeLabel} without nominations.`);

		handler.rollWinner();

		this.privateModAction(`(${user.name} has ended nominations for the ${handler.name} of the ${handler.timeLabel}.)`);
		this.modlog(`${handler.id.toUpperCase()} END`, null);
	},
	endhelp: [`/-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # & ~`],

	nom(target, room, user) {
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help otd');

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (!toNominationId(target).length || target.length > 50) return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);

		handler.addNomination(user, target);
	},
	nomhelp: [`/-otd nom [nomination] - Nominate something for Thing of the Day.`],

	view(target, room, user, connection) {
		if (!this.canTalk()) return;
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (this.broadcasting) {
			selectHandler(this.message).display();
		} else {
			selectHandler(this.message).displayTo(connection);
		}
	},
	viewhelp: [`/-otd view - View the current nominations for the Thing of the Day.`],

	remove(target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		let userid = toId(target);
		if (!userid) return this.errorReply(`'${target}' is not a valid username.`);

		if (handler.removeNomination(userid)) {
			this.privateModAction(`(${user.name} removed ${target}'s nomination for the ${handler.name} of the ${handler.timeLabel}.)`);
			this.modlog(`${handler.id.toUpperCase()} REMOVENOM`, userid);
		} else {
			this.sendReply(`User '${target}' has no nomination for the ${handler.name} of the ${handler.timeLabel}.`);
		}
	},
	removehelp: [`/-otd remove [username] - Remove a user's nomination for the Thing of the Day and prevent them from voting again until the next round. Requires: % @ # & ~`],

	force(target, room, user) {
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help aotd force');

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('declare', null, room)) return false;

		if (!toNominationId(target).length || target.length > 50) return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);

		handler.forceWinner(target, user.name);
		this.privateModAction(`(${user.name} forcibly set the ${handler.name} of the ${handler.timeLabel} to ${target}.)`);
		this.modlog(`${handler.id.toUpperCase()} FORCE`, user.name, target);
		room.add(`The ${handler.name} of the ${handler.timeLabel} was forcibly set to '${target}'`);
	},
	forcehelp: [`/-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # & ~`],

	delay(target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (!(handler.voting && handler.timer)) return this.errorReply(`There is no ${handler.name} of the ${handler.timeLabel} nomination to disable the timer for.`);

		clearTimeout(handler.timer);

		this.privateModAction(`(${user.name} disabled the ${handler.name} of the ${handler.timeLabel} timer.)`);
	},
	delayhelp: [`/-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # & ~`],

	set(target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		let params = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());

		/** @type {{[k: string]: string}} */
		let changelist = {};

		for (const param of params) {
			let [key, ...values] = param.split(':');
			if (!key || !values.length) return this.errorReply(`Syntax error in '${param}'`);

			key = key.trim();
			let value = values.join(':').trim();

			if (!handler.keys.includes(key)) return this.errorReply(`Invalid value for property: ${key}`);

			switch (key) {
			case 'artist':
			case 'film':
			case 'show':
			case 'channel':
			case 'book':
			case 'author':
				if (!toNominationId(value) || value.length > 50) return this.errorReply(`Please enter a valid ${key} name.`);
				break;
			case 'quote':
			case 'tagline':
			case 'match':
			case 'event':
				if (!value.length || value.length > 150) return this.errorReply(`Please enter a valid ${key}.`);
				break;
			case 'song':
				if (!value.length || value.length > 50) return this.errorReply("Please enter a valid song name.");
				break;
			case 'link':
			case 'image':
				if (!/https?:\/\//.test(value)) return this.errorReply(`Please enter a valid URL for the ${key} (starting with http:// or https://)`);
				if (value.length > 200) return this.errorReply("URL too long.");
				break;
			default:
				return this.errorReply(`Invalid value for property: ${key}`);
			}

			changelist[key] = value;
		}

		let keys = Object.keys(changelist);

		if (keys.length) {
			handler.setWinnerProperty(changelist);
			this.modlog(handler.id.toUpperCase(), null, `changed ${keys.join(', ')}`);
			return this.privateModAction(`(${user.name} changed the following propert${Chat.plural(keys, 'ies', 'y')} of the ${handler.name} of the ${handler.timeLabel}: ${keys.join(', ')})`);
		}
	},
	sethelp: [`/-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day. Requires: % @ # & ~`],

	winners(target, room, user, connection) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);
		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		return this.parse(`/join view-${handler.id}`);
	},
	winnershelp: [`/-otd winners - Displays a list of previous things of the day.`],

	''(target, room) {
		if (!this.canTalk()) return;
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);
		if (!handler.room) return this.errorReply(`The room for this -otd doesn't exist.`);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		handler.generateWinnerDisplay().then(text => {
			if (!text) return this.errorReply("There is no winner yet.");
			this.sendReplyBox(text);
			this.room.update();
		});
	},
};

/** @type {PageTable} */
const pages = {
	aotd() {
		return aotd.generateWinnerList(this);
	},
	fotd() {
		return fotd.generateWinnerList(this);
	},
	sotd() {
		return sotd.generateWinnerList(this);
	},
	cotd() {
		return cotd.generateWinnerList(this);
	},
	botw() {
		return botw.generateWinnerList(this);
	},
	motw() {
		return motw.generateWinnerList(this);
	},
};
exports.pages = pages;

const help = [
	`Thing of the Day plugin commands (aotd, fotd, sotd, cotd, botw, motw):`,
	`- /-otd - View the current Thing of the Day.`,
	`- /-otd start - Starts nominations for the Thing of the Day. Requires: % @ # & ~`,
	`- /-otd nom [nomination] - Nominate something for Thing of the Day.`,
	`- /-otd remove [username] - Remove a user's nomination for the Thing of the Day and prevent them from voting again until the next round. Requires: % @ # & ~`,
	`- /-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # & ~`,
	`- /-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # & ~`,
	`- /-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # & ~`,
	`- /-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day. Requires: % @ # & ~`,
	`- /-otd winners - Displays a list of previous things of the day.`,
];

exports.commands = {
	aotd: commands,
	fotd: commands,
	sotd: commands,
	cotd: commands,
	botw: commands,
	motw: commands,
	aotdhelp: help,
	otdhelp: help,
};
