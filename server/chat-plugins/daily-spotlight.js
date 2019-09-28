'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const DAY = 24 * 60 * 60 * 1000;
const SPOTLIGHT_FILE = 'config/chat-plugins/spotlights.json';

/** @type {{[k: string]: {[k: string]: {image: string?, description: string}[]}}} */
let spotlights = {};
try {
	spotlights = require(`../../${SPOTLIGHT_FILE}`);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}
if (!spotlights || typeof spotlights !== 'object') spotlights = {};

function saveSpotlights() {
	FS(SPOTLIGHT_FILE).writeUpdate(() => JSON.stringify(spotlights));
}

function nextDaily() {
	for (const roomid in spotlights) {
		for (const key in spotlights[roomid]) {
			if (spotlights[roomid][key].length > 1) {
				spotlights[roomid][key].shift();
			}
		}
	}

	saveSpotlights();
	timeout = setTimeout(nextDaily, DAY);
}

const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
let timeout = setTimeout(nextDaily, midnight.valueOf() - Date.now());

/**
 * @param {string?} image
 * @param {string} description
 */
async function renderSpotlight(image, description) {
	let imgHTML = '';

	if (image) {
		const [width, height] = await Chat.fitImage(image, 150, 300);
		imgHTML = `<td><img src="${image}" width="${width}" height="${height}" style="vertical-align:middle;"></td>`;
	}

	return `<table style="text-align:center;margin:auto"><tr><td style="padding-right:10px;">${Chat.formatText(description, true).replace(/\n/g, `<br />`)}</td>${imgHTML}</tr></table>`;
}

exports.destroy = function () {
	clearTimeout(timeout);
};

/** @type {PageTable} */
const pages = {
	async spotlights(query, user, connection) {
		this.title = 'Daily Spotlights';
		this.extractRoom();
		let buf = `<div class="pad ladder"><h2>Daily Spotlights</h2>`;
		if (!spotlights[this.room.roomid]) {
			buf += `<p>This room has no daily spotlights.</p></div>`;
		} else {
			for (let key in spotlights[this.room.roomid]) {
				buf += `<table style="margin-bottom:30px;"><th colspan="2"><h3>${key}:</h3></th>`;
				for (const [i, spotlight] of spotlights[this.room.roomid][key].entries()) {
					const html = await renderSpotlight(spotlight.image, spotlight.description);
					buf += `<tr><td>${i ? i : 'Current'}</td><td>${html}</td></tr>`;
					// @ts-ignore room is definitely a proper room here.
					if (!user.can('announce', null, this.room)) break;
				}
				buf += '</table>';
			}
		}
		return buf;
	},
};
exports.pages = pages;

/** @type {ChatCommands} */
const commands = {
	async removedaily(target, room, user) {
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let [key, rest] = target.split(',');
		key = toID(key);
		if (!key) return this.parse('/help daily');
		if (!spotlights[room.roomid][key]) return this.errorReply(`Cannot find a daily spotlight with name '${key}'`);

		if (!this.can('announce', null, room)) return false;
		if (rest) {
			const queueNumber = parseInt(rest);
			if (isNaN(queueNumber) || queueNumber < 1) return this.errorReply("Invalid queue number");
			if (queueNumber >= spotlights[room.roomid][key].length) {
				return this.errorReply(`Queue number needs to be between 1 and ${spotlights[room.roomid][key].length - 1}`);
			}
			spotlights[room.roomid][key].splice(queueNumber, 1);
			saveSpotlights();

			this.modlog(`DAILY REMOVE`, `${key}[${queueNumber}]`);
			this.sendReply(`Removed the ${queueNumber}th entry from the queue of the daily spotlight named '${key}'.`);
		} else {
			spotlights[room.roomid][key].shift();
			if (!spotlights[room.roomid][key].length) {
				delete spotlights[room.roomid][key];
			}
			saveSpotlights();
			this.modlog(`DAILY REMOVE`, key);
			this.sendReply(`The daily spotlight named '${key}' has been successfully removed.`);
		}
	},
	queuedaily: 'setdaily',
	async setdaily(target, room, user, connection, cmd) {
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let [key, ...rest] = target.split(',');
		key = toID(key);
		if (!key) return this.parse('/help daily');
		if (key.length > 20) return this.errorReply("Spotlight names can be a maximum of 20 characters long.");
		if (key === 'constructor') return false;

		if (!this.can('announce', null, room)) return false;
		if (!rest.length) return this.parse('/help daily');
		let image, description;
		if (rest[0].trim().startsWith('http://') || rest[0].trim().startsWith('https://')) {
			[image, ...rest] = rest;
			image = image.trim();
			const ret = await Chat.getImageDimensions(image);
			if (ret.err) return this.errorReply(`Invalid image url: ${image}`);
		}
		description = rest.join(',');
		if (Chat.stripFormatting(description).length > 500) return this.errorReply("Descriptions can be at most 500 characters long.");
		const obj = {image: image || null, description: description};
		if (!spotlights[room.roomid]) spotlights[room.roomid] = {};
		if (!spotlights[room.roomid][key]) spotlights[room.roomid][key] = [];
		if (cmd === 'setdaily') {
			spotlights[room.roomid][key].shift();
			spotlights[room.roomid][key].unshift(obj);

			this.modlog('SETDAILY', key, `${image ? `${image}, ` : ''}${description}`);
			this.privateModAction(`${user.name} set the daily ${key}.`);
		} else {
			spotlights[room.roomid][key].push(obj);
			this.modlog('QUEUEDAILY', key, `${image ? `${image}, ` : ''}${description}`);
			this.privateModAction(`${user.name} queued a daily ${key}.`);
		}

		saveSpotlights();
	},
	async daily(target, room, user) {
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let key = toID(target);
		if (!key) return this.parse('/help daily');

		if (!spotlights[room.roomid] || !spotlights[room.roomid][key]) {
			return this.errorReply(`Cannot find a daily spotlight with name '${key}'`);
		}

		if (!this.runBroadcast()) return;

		const {image, description} = spotlights[room.roomid][key][0];
		const html = await renderSpotlight(image, description);

		this.sendReplyBox(html);
		room.update();
	},
	viewspotlights(target, room, user) {
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		return this.parse(`/join view-spotlights-${room.roomid}`);
	},

	dailyhelp: [
		`Daily spotlights plugin:`,
		`- /daily [name] - Shows the daily spotlight.`,
		`- !daily [name] - Shows the daily spotlight to everyone. Requires: + % @ # & ~`,
		`- /setdaily [name], [image], [description] - Sets the daily spotlight. Image can be left out. Requires: % @ # & ~`,
		`- /queuedaily [name], [image], [description] - Queues a daily spotlight. At midnight, the spotlight with this name will automatically switch to the next queued spotlight. Image can be left out. Requires: % @ # & ~`,
		`- /removedaily [name][, queue number] - If no queue number is provided, deletes all queued and current spotlights with the given name. If a number is provided, removes a specific future spotlight from the queue. Requires: % @ # & ~`,
		`- /viewspotlights - Shows all current spotlights in the room. For staff, also shows queued spotlights.`,
	],
};

exports.commands = commands;

process.nextTick(() => {
	Chat.multiLinePattern.register('/(queue|set)daily ');
});
