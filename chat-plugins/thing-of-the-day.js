'use strict';

const FS = require('./../lib/fs');

const MINUTE = 60 * 1000;
const YEAR = 365 * 24 * 60 * MINUTE;

const theStudio = Rooms.get('thestudio');
const tvbf = Rooms.get('tvbooksfilms');
const yt = Rooms.get('youtube');

const AOTDS_FILE = 'config/chat-plugins/thestudio.tsv';
const FOTDS_FILE = 'config/chat-plugins/tvbf-films.tsv';
const BOTDS_FILE = 'config/chat-plugins/tvbf-books.tsv';
const SOTDS_FILE = 'config/chat-plugins/tvbf-shows.tsv';
const COTDS_FILE = 'config/chat-plugins/youtube-channels.tsv';
const PRENOMS_FILE = 'config/chat-plugins/otd-prenoms.json';

let prenoms = {};
try {
	prenoms = require(`../${PRENOMS_FILE}`);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}
if (!prenoms || typeof prenoms !== 'object') prenoms = {};

function savePrenoms() {
	FS(PRENOMS_FILE).write(JSON.stringify(prenoms));
}

function toNominationId(nomination) { // toId would return '' for foreign/sadistic nominations
	return nomination.toLowerCase().replace(/\s/g, '').replace(/\b&\b/g, '');
}

class OtdHandler {
	constructor(id, name, room, filename, keys, keyLabels) {
		this.id = id;
		this.name = name;
		this.room = room;

		this.nominations = new Map(prenoms[id]);
		this.removedNominations = new Map();

		this.voting = false;
		this.timer = null;

		this.file = FS(filename);

		this.keys = keys;
		this.keyLabels = keyLabels;

		this.winners = [];

		this.file.read().then(data => {
			data = ('' + data).split("\n");
			for (const arg of data) {
				if (!arg || arg === '\r') continue;
				if (arg.startsWith(`${this.keyLabels[0]}\t`)) continue;
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
		clearTimeout(this.timer);
	}

	addNomination(user, nomination) {
		const id = toNominationId(nomination);

		if (this.winners.slice(this.room === tvbf ? -10 : -30).some(entry => toNominationId(entry[this.keys[0]]) === id)) return user.sendTo(this.room, `This ${this.name.toLowerCase()} has already been ${this.id} in the past month.`);

		for (const value of this.removedNominations.values()) {
			if (toId(user) in value.userids || user.latestIp in value.ips) return user.sendTo(this.room, `Since your nomination has been removed by staff, you cannot submit another ${this.name.toLowerCase()} until the next round.`);
		}

		if (this.nominations.has(id)) return user.sendTo(this.room, "This artist has already been nominated.");

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
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for ${this.name} of the Day are in progress! Use <code>/${this.id} nom</code> to nominate a${['A', 'E', 'I', 'O', 'U'].includes(this.name[0]) ? 'n' : ''} ${this.name.toLowerCase()}!</p>`;
			if (this.nominations.size) buffer += `<span style="font-weight:bold;">Nominations:</span>`;
			buffer += `<ul>`;
		} else {
			buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:10pt;">Pre-noms for ${this.name} of the Day:</p>`;
		}

		this.nominations.forEach((value, key) => {
			buffer += Chat.html `<li><b>${value.nomination}</b> <i>(Submitted by ${value.name})</i></li>`;
		});

		buffer += `</ul></div>`;

		return buffer;
	}

	display() {
		this.room.add(`|uhtml|otd|${this.generateNomWindow()}`);
	}

	displayTo(connection) {
		connection.sendTo(this.room, `|uhtml|otd|${this.generateNomWindow()}`);
	}

	rollWinner() {
		let keys = Array.from(this.nominations.keys());
		if (!keys.length) return false;

		let winner = this.nominations.get(keys[Math.floor(Math.random() * keys.length)]);
		this.appendWinner(winner.nomination, winner.name);

		this.room.add(Chat.html `|uhtml|otd|<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for ${this.name} of the Day are over!</p><p style="tex-align:center;font-size:10pt;">Out of ${keys.length} nominations, we randomly selected <strong>${winner.nomination}</strong> as the winner! (Nomination by ${winner.name})</p></div>`);
		this.room.update();

		this.finish();
		return true;
	}

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

	forceWinner(winner, user) {
		this.appendWinner(winner, user);
		this.finish();
	}

	appendWinner(nomination, user) {
		const entry = {time: Date.now(), nominator: user};
		entry[this.keys[0]] = nomination;
		this.winners.push(entry);
		this.saveWinners();
	}

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

	generateWinnerDisplay() {
		if (!this.winners.length) return false;
		let winner = this.winners[this.winners.length - 1];

		let output = Chat.html `<div class="broadcast-blue" style="text-align:center;"><p><span style="font-weight:bold;font-size:11pt">The ${this.name} of the Day is ${winner[this.keys[0]]}.</span>`;
		if (winner.quote) output += Chat.html `<br/><span style="font-style:italic;">"${winner.quote}"</span>`;
		if (winner.tagline) output += Chat.html `<br/>${winner.tagline}`;
		output += `</p><table style="margin:auto;"><tr>`;
		if (winner.image) output += Chat.html `<td><img src="${winner.image}" width=100 height=100></td>`;
		output += `<td style="text-align:right;margin:5px;">`;
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

	generateWinnerList(year) {
		let output = `|wide||html|`;

		if (!this.winners.length) return output + `No past winners found.`;

		let now = Date.now();

		for (let i = this.winners.length - 1; i >= 0; i--) {
			let date = new Date(this.winners[i].time);
			if (year) {
				if (date.getFullYear() !== year) continue;
			} else if (now - this.winners[i].time > YEAR) {
				break;
			}

			const pad = num => num < 10 ? '0' + num : num;

			output += Chat.html `[${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}] ${this.winners[i][this.keys[0]]}`;
			if (this.winners[i].song) {
				output += `: `;
				if (this.winners[i].link) {
					output += Chat.html `<a href="${this.winners[i].link}">${this.winners[i].song}</a>`;
				} else {
					output += Chat.escapeHTML(this.winners[i].song);
				}
			} else if (this.winners[i].link) {
				output += Chat.html `<a href="${this.winners[i].link}">${this.winners[i].link}</a>`;
			}

			output += Chat.html ` (nominated by ${this.winners[i].nominator})<br/>`;
		}

		return output;
	}
}

const aotd = new OtdHandler('aotd', 'Artist', theStudio, AOTDS_FILE, ['artist', 'nominator', 'quote', 'song', 'link', 'image', 'time'], ['Artist', 'Nominator', 'Quote', 'Song', 'Link', 'Image', 'Timestamp']);
const fotd = new OtdHandler('fotd', 'Film', tvbf, FOTDS_FILE, ['film', 'nominator', 'quote', 'link', 'image', 'time'], ['Film', 'Nominator', 'Quote', 'Link', 'Image', 'Timestamp']);
const botd = new OtdHandler('botd', 'Book', tvbf, BOTDS_FILE, ['book', 'nominator', 'quote', 'link', 'image', 'time'], ['Book', 'Nominator', 'Quote', 'Link', 'Image', 'Timestamp']);
const sotd = new OtdHandler('sotd', 'Show', tvbf, SOTDS_FILE, ['show', 'nominator', 'quote', 'link', 'image', 'time'], ['Show', 'Nominator', 'Quote', 'Link', 'Image', 'Timestamp']);
const cotd = new OtdHandler('cotd', 'Channel', yt, COTDS_FILE, ['channel', 'nominator', 'link', 'tagline', 'image', 'time'], ['Show', 'Nominator', 'Link', 'Tagline', 'Image', 'Timestamp']);

function selectHandler(message) {
	let id = toId(message.substring(1, 5));
	switch (id) {
	case 'aotd':
		return aotd;
	case 'fotd':
		return fotd;
	case 'botd':
		return botd;
	case 'sotd':
		return sotd;
	case 'cotd':
		return cotd;
	default:
		throw new Error("Invalid type for otd handler.");
	}
}

let commands = {
	start: function (target, room, user, connection, cmd) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (handler.voting) return this.errorReply(`The nomination for the ${handler.name} of the Day nomination is already in progress.`);
		handler.startVote();

		this.privateModAction(`(${user.name} has started nominations for the ${handler.name} of the Day.)`);
		this.modlog(`${handler.id.toUpperCase()} START`);
	},
	starthelp: [`/-otd start - Starts nominations for the Thing of the Day. Requires: % @ # & ~`],

	end: function (target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (!handler.voting) return this.errorReply(`There is no ${handler.name} of the Day nomination in progress.`);

		if (!handler.nominations.size) return this.errorReply(`Can't select the ${handler.name} of the Day without nominations.`);

		handler.rollWinner();

		this.privateModAction(`(${user.name} has ended nominations for the ${handler.name} of the Day.)`);
		this.modlog(`${handler.id.toUpperCase()} END`);
	},
	endhelp: [`/-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # & ~`],

	nom: function (target, room, user) {
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help otd');

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (!toNominationId(target).length || target.length > 50) return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);

		handler.addNomination(user, target);
	},
	nomhelp: [`/-otd nom [nomination] - Nominate something for Thing of the Day.`],

	view: function (target, room, user, connection) {
		if (!this.canTalk()) return;
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		if (this.broadcasting) {
			selectHandler(this.message).display();
		} else {
			selectHandler(this.message).displayTo(connection);
		}
	},
	viewhelp: [`/-otd view - View the current nominations for the Thing of the Day.`],

	remove: function (target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		target = this.splitTarget(target);
		let name = this.targetUsername;
		let userid = toId(name);
		if (!userid) return this.errorReply(`'${name}' is not a valid username.`);

		if (handler.removeNomination(userid)) {
			this.privateModAction(`(${user.name} removed ${this.targetUsername}'s nomination for the ${handler.name} of the Day.)`);
			this.modlog(`${handler.id.toUpperCase()} REMOVENOM`, userid);
		} else {
			this.sendReply(`User '${name}' has no nomination for the ${handler.name} of the Day.`);
		}
	},
	removehelp: [`/-otd remove [username] - Remove a user's nomination for the Thing of the Day and prevent them from voting again until the next round. Requires: % @ * # & ~`],

	force: function (target, room, user) {
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help aotd force');

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('declare', null, room)) return false;

		if (!toNominationId(target).length || target.length > 50) return this.sendReply(`'${target}' is not a valid ${handler.name.toLowerCase()} name.`);

		handler.forceWinner(target, user.name);
		this.privateModAction(`(${user.name} forcibly set the ${handler.name} of the Day to ${target}.)`);
		this.modlog(`${handler.id.toUpperCase()} FORCE`, user.name, target);
		room.add(`The ${handler.name} of the Day was forcibly set to '${target}'`);
	},
	forcehelp: [`/-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # & ~`],

	delay: function (target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		if (!(handler.voting && handler.timer)) return this.errorReply(`There is no ${handler.name} of the Day nomination to disable the timer for.`);

		clearTimeout(handler.timer);

		this.privateModAction(`(${user.name} disabled the ${handler.name} of the Day timer.)`);
	},
	delayhelp: [`/-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # & ~`],

	set: function (target, room, user) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);
		if (!this.can('mute', null, room)) return false;

		let params = target.split(target.includes('|') ? '|' : ',').map(param => param.trim());

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
			case 'book':
			case 'channel':
				if (!toNominationId(value) || value.length > 50) return this.errorReply(`Please enter a valid ${key} name.`);
				break;
			case 'quote':
			case 'tagline':
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
			this.modlog('handler.id.toUpperCase()', null, `changed ${keys.join(', ')}`);
			return this.privateModAction(`(${user.name} changed the following propert${Chat.plural(keys, 'ies', 'y')} of the ${handler.name} of the Day: ${keys.join(', ')})`);
		}
	},
	sethelp: [`/-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day. Requires: % @ * # & ~`],

	winners: function (target, room, user, connection) {
		if (!this.canTalk()) return;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		return connection.popup(selectHandler(this.message).generateWinnerList(parseInt(target)));
	},
	winnershelp: [`/-otd winners [year] - Displays a list of previous things of the day of the past year. Optionally, specify a year to see all winners in that year.`],

	'': function (target, room) {
		if (!this.canTalk()) return;
		if (!this.runBroadcast()) return false;

		const handler = selectHandler(this.message);

		if (room !== handler.room) return this.errorReply(`This command can only be used in ${handler.room.title}.`);

		let text = handler.generateWinnerDisplay();
		if (!text) return this.errorReply("There is no winner yet.");
		return this.sendReplyBox(text);
	},
};

const help = [
	`Thing of the Day plugin commands (aotd, fotd, botd, sotd, cotd):`,
	`- /-otd - View the current Thing of the Day.`,
	`- /-otd start - Starts nominations for the Thing of the Day. Requires: % @ # & ~`,
	`- /-otd nom [nomination] - Nominate something for Thing of the Day.`,
	`- /-otd remove [username] - Remove a user's nomination for the Thing of the Day and prevent them from voting again until the next round. Requires: % @ * # & ~`,
	`- /-otd end - End nominations for the Thing of the Day and set it to a randomly selected nomination. Requires: % @ # & ~`,
	`- /-otd force [nomination] - Forcibly sets the Thing of the Day without a nomination round. Requires: # & ~`,
	`- /-otd delay - Turns off the automatic 20 minute timer for Thing of the Day voting rounds. Requires: % @ # & ~`,
	`- /-otd set property: value[, property: value] - Set the winner, quote, song, link or image for the current Thing of the Day. Requires: % @ * # & ~`,
	`- /-otd winners [year] - Displays a list of previous things of the day of the past year. Optionally, specify a year to see all winners in that year.`,
];

exports.commands = {
	aotd: commands,
	fotd: commands,
	botd: commands,
	sotd: commands,
	cotd: commands,
	aotdhelp: help,
	otdhelp: help,
};
