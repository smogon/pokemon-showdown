/**
 * The Studio: Artist of the Day plugin
 * This is a daily activity where users nominate the featured artist for the day, which is selected randomly once voting has ended.
 * Only works in a room with the id 'thestudio'
 */

'use strict';

// This plugin is still a work in progress, so don't hold back if there are things you find need changing! (Especially UX things.)

const fs = require('fs');
const path = require('path');

const YEAR = 365 * 24 * 60 * 60 * 1000;

const AOTDS_FILE = path.resolve(__dirname, '../config/chat-plugins/thestudio.tsv');

const theStudio = Rooms.get('thestudio');

// Persistence
let winners = [];

// Don't load the file if the room doesn't exist.
if (theStudio) {
	fs.readFile(AOTDS_FILE, (err, data) => {
		if (err) return;
		data = ('' + data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i] || data[i] === '\r') continue;
			let [artist, nominator, quote, song, link, image, time] = data[i].trim().split("\t");
			if (artist === "Artist") continue;
			time = Number(time) || 0;
			winners.push({artist: artist, nominator: nominator, quote: quote, song: song, link: link, image: image, time: time});
		}
	});
}

function saveWinners() {
	let buf = "Artist\tNominator\tQuote\tSong\tLink\tImage\tTimestamp\n";
	for (let i = 0; i < winners.length; i++) {
		const {artist, nominator, quote, song, link, image, time} = winners[i];

		buf += `${artist || ''}\t${nominator || ''}\t${quote || ''}\t${song || ''}\t${link || ''}\t${image || ''}\t${time || 0}\n`;
	}

	fs.writeFile(AOTDS_FILE, buf, () => {});
}

// These are passed to the constructor and used as ArtistOfTheDayVote.nominations. It's defined here to allow prenoms.
let nominations = new Map();
let removedNominations = new Map();

function toArtistId(artist) { // toId would return '' for foreign/sadistic artists
	return artist.toLowerCase().replace(/\s/g, '').replace(/\b&\b/g, '');
}

function addNomination(user, artist) {
	const id = toArtistId(artist);

	if (winners.length && toArtistId(winners[winners.length - 1].artist) === id) return user.sendTo(theStudio, "This artist is already the current Artist of the Day.");

	for (let value of removedNominations.values()) {
		if (toId(user) in value.userids || user.latestIp in value.ips) return user.sendTo(theStudio, "Since your nomination has been removed by staff, you cannot submit another artist until the next round.");
	}

	if (nominations.has(toArtistId(artist))) return user.sendTo(theStudio, "This artist has already been nominated.");

	for (let [key, value] of nominations) {
		if (toId(user) in value.userids || user.latestIp in value.ips) {
			user.sendTo(theStudio, `Your previous vote for ${value.artist} will be removed.`);
			nominations.delete(key);
		}
	}

	let obj = {};
	obj[user.userid] = user.name;
	nominations.set(toArtistId(artist), {artist: artist, name: user.name, userids: Object.assign(obj, user.prevNames), ips: Object.assign({}, user.ips)});

	user.sendTo(theStudio, `Your nomination for ${artist} was successfully submitted.`);

	if (theStudio.aotdVote) theStudio.aotdVote.display(true);
}

function removeNomination(name) {
	name = toId(name);

	let success = false;
	nominations.forEach((value, key) => {
		if (name in value.userids) {
			removedNominations.set(key, value);
			nominations.delete(key);
			success = true;
		}
	});

	if (theStudio.aotdVote) theStudio.aotdVote.display(true);
	return success;
}

function appendWinner(artist, nominator) {
	winners.push({artist: artist, nominator: nominator, time: Date.now()});
	saveWinners();
}

function setWinnerProperty(properties) {
	if (!winners.length) return;
	for (let i in properties) {
		winners[winners.length - 1][i] = properties[i];
	}
	saveWinners();
}

function generateAotd() {
	if (!winners.length) return false;
	let aotd = winners[winners.length - 1];

	let output = Chat.html `<div class="broadcast-blue" style="text-align:center;"><p><span style="font-weight:bold;font-size:11pt">The Artist of the Day is ${aotd.artist || "Various Artists"}.</span>`;
	if (aotd.quote) output += Chat.html `<br/><span style="font-style:italic;">"${aotd.quote}"</span>`;
	output += `</p><table style="margin:auto;"><tr>`;
	if (aotd.image) output += Chat.html `<td><img src="${aotd.image}" width=100 height=100></td>`;
	output += `<td style="text-align:right;margin:5px;">`;
	if (aotd.song) {
		output += `<b>Song:</b> `;
		if (aotd.link) {
			output += Chat.html `<a href="${aotd.link}">${aotd.song}</a>`;
		} else {
			output += Chat.escapeHTML(aotd.song);
		}
		output += `<br/>`;
	}
	output += Chat.html `Nominated by ${aotd.nominator}.`;
	output += `</td></tr></table></div>`;

	return output;
}

function generateWinnerList(year) {
	let output = `|wide||html|`;

	if (!winners.length) return output + `No past winners found.`;

	let now = Date.now();

	for (let i = winners.length - 1; i >= 0; i--) {
		let date = new Date(winners[i].time);
		if (year) {
			if (date.getFullYear() !== year) continue;
		} else if (now - winners[i].time > YEAR) {
			break;
		}

		const pad = num => num < 10 ? '0' + num : num;

		output += Chat.html `[${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}] ${winners[i].artist}`;
		if (winners[i].song) {
			output += `: `;
			if (winners[i].link) {
				output += Chat.html `<a href="${winners[i].link}">${winners[i].song}</a>`;
			} else {
				output += Chat.escapeHTML(winners[i].song);
			}
		}

		output += Chat.html ` (nominated by ${winners[i].nominator})<br/>`;
	}

	return output;
}

function generateNomWindow() {
	let buffer = '';

	if (theStudio.aotdVote) {
		buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for Artist of the Day are in progress! Use <code>/aotd nom</code> to nominate an artist!</p>`;
		if (nominations.size) buffer += `<span style="font-weight:bold;">Nominations:</span>`;
		buffer += `<ul>`;
	} else {
		buffer += `<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:10pt;">Pre-noms for Artist of the Day:</p>`;
	}

	nominations.forEach((value, key) => {
		buffer += Chat.html `<li><b>${value.artist}</b> <i>(Submitted by ${value.name})</i></li>`;
	});

	buffer += `</ul></div>`;

	return buffer;
}

class ArtistOfTheDayVote {
	constructor(room) {
		this.room = room;

		this.nominations = nominations;
		this.removedNominations = removedNominations;

		this.room.aotdVote = this;
	}

	finish() {
		nominations = new Map();
		removedNominations = new Map();
		delete this.room.aotdVote;
	}

	display(update) {
		this.room.add(`|uhtml${update ? 'change' : ''}|aotd|${generateNomWindow()}`);
	}

	displayTo(connection) {
		connection.sendTo(this.room, `|uhtml|aotd|${generateNomWindow()}`);
	}

	runAotd() {
		let keys = Array.from(this.nominations.keys());
		if (!keys.length) return false;

		let winner = this.nominations.get(keys[Math.floor(Math.random() * keys.length)]);
		appendWinner(winner.artist, winner.name);

		this.room.add(Chat.html `|html|<div class="broadcast-blue"><p style="font-weight:bold;text-align:center;font-size:12pt;">Nominations for Artist of the Day are over!</p><p style="tex-align:center;font-size:10pt;">Out of ${keys.length} nominations, we randomly selected <strong>${winner.artist}</strong> as the winner! (Nomination by ${winner.name})</p></div>`);

		this.finish();
		return true;
	}
}

let commands = {
	start: function (target, room, user) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;
		if (room.aotdVote) return this.errorReply("There is already an Artist of the Day nomination in progress.");

		room.aotdVote = new ArtistOfTheDayVote(room);
		room.aotdVote.display(false);
		this.privateModCommand(`(${user.name} has started nominations for the Artist of the Day.)`);
	},
	starthelp: ["/aotd start - Starts nominations for the Artist of the Day. Requires: % @ # & ~"],

	end: function (target, room, user) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.aotdVote) return this.errorReply("There is no Artist of the Day nomination in progress.");

		if (!room.aotdVote.runAotd()) return this.errorReply("Can't select an Artist of the Day without nominations.");

		this.privateModCommand(`(${user.name} has ended nominations for the Artist of the Day.)`);
	},
	endhelp: ["/aotd end - End nominations for the Artist of the Day and set it to a randomly selected artist. Requires: % @ # & ~"],

	nom: function (target, room, user) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.canTalk()) return;
		if (!target) this.parse('/help aotd prenom');

		if (!toArtistId(target).length || target.length > 50) return this.sendReply(`'${target}' is not a valid artist name.`);

		addNomination(user, target);
	},
	nomhelp: ["/aotd nom [artist] - Nominate an artist for the Artist of the Day."],

	view: function (target, room, user, connection) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.canTalk()) return;

		if (!room.aotdVote) {
			if (!user.can('mute', null, room)) return false;

			return this.sendReply(`|raw|${generateNomWindow()}`);
		}

		if (!this.runBroadcast()) return false;

		if (this.broadcasting) {
			room.aotdVote.display();
		} else {
			room.aotdVote.displayTo(connection);
		}
	},
	viewhelp: ["/aotd view - View the current nominations for the Artist of the Day. Requires: % @ * # & ~"],

	remove: function (target, room, user) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		target = this.splitTarget(target);
		let name = this.targetUsername;
		let userid = toId(name);
		if (!userid) return this.errorReply(`'${name}' is not a valid username.`);

		if (removeNomination(userid)) {
			this.privateModCommand(`(${user.name} removed ${this.targetUsername}'s nomination for the Artist of the Day.)`);
		} else {
			this.sendReply(`User '${name}' has no nomination for the Artist of the Day.`);
		}
	},
	removehelp: ["/aotd remove [username] - Remove a user's nomination for the Artist of the Day and prevent them from voting again until the next round. Requires: % @ * # & ~"],

	set: function (target, room, user) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!target) this.parse('/help aotd set');
		if (!room.chatRoomData || !this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		let params = target.split(',').map(param => param.trim());

		let changelist = {};

		for (let i = 0; i < params.length; i++) {
			let [key, ...values] = params[i].split(':');
			if (!key || !values.length) return this.errorReply(`Syntax error in '${params[i]}'`);

			key = key.trim();
			let value = values.join(':').trim();

			if (!['artist', 'quote', 'song', 'link', 'image'].includes(key)) return this.errorReply(`Invalid value for property: ${key}`);

			switch (key) {
			case 'artist':
				if (!toArtistId(value) || value.length > 50) return this.errorReply("Please enter a valid artist name.");
				break;
			case 'quote':
				if (!value.length || value.length > 150) return this.errorReply("Please enter a valid quote.");
				break;
			case 'song':
				if (!value.length || value.length > 50) return this.errorReply("Please enter a valid song name.");
				break;
			case 'link':
			case 'image':
				if (!/https?:\/\/[^ ]+\//.test(value)) return this.errorReply(`Please enter a valid URL for the ${key} (starting with http:// or https://)`);
				if (value.length > 200) return this.errorReply("URL too long.");
				break;
			default:
				return this.errorReply(`Invalid value for property: ${key}`);
			}

			changelist[key] = value;
		}

		let keys = Object.keys(changelist);

		if (keys.length) {
			setWinnerProperty(changelist);
			return this.privateModCommand(`(${user.name} changed the following propert${Chat.plural(keys, 'ies', 'y')} of the Artist of the Day: ${keys.join(', ')})`);
		}
	},
	sethelp: ["/aotd set property: value[, property: value] - Set the artist, quote, song, link or image for the current Artist of the Day. Requires: % @ * # & ~"],

	winners: function (target, room, user, connection) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.canTalk()) return false;

		return connection.popup(generateWinnerList(parseInt(target)));
	},
	winnershelp: ["/aotd winners [year] - Displays a list of previous artists of the day of the past year. Optionally, specify a year to see all winners in that year."],

	'': function (target, room) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.runBroadcast()) return false;
		let text = generateAotd();
		if (!text) return this.errorReply("No aotd found");
		return this.sendReplyBox(text);
	},

	help: function (target, room) {
		if (room !== theStudio) return this.errorReply('This command can only be used in The Studio.');
		if (!this.runBroadcast()) return false;
		this.sendReply("Use /help aotd to view help for all commands, or /help aotd [command] for help on a specific command.");
	},
};

exports.commands = {
	aotd: commands,
	aotdhelp: [
		"The Studio: Artist of the Day plugin commands:",
		"- /aotd - View the Artist of the Day.",
		"- /aotd start - Start nominations for the Artist of the Day. Requires: % @ * # & ~",
		"- /aotd nom [artist] - Nominate an artist for the Artist of the Day.",
		"- /aotd remove [username] - Remove a user's nomination for the Artist of the Day and prevent them from voting again until the next round. Requires: % @ * # & ~",
		"- /aotd end - End nominations for the Artist of the Day and set it to a randomly selected artist. Requires: % @ * # & ~",
		"- /aotd set property: value[, property: value] - Set the artist, quote, song, link or image for the current Artist of the Day. Requires: % @ * # & ~",
		"- /aotd winners [year] - Displays a list of previous artists of the day of the past year. Optionally, specify a year to see all winners in that year.",
	],
};