/**
 * Chat plugin for repeating messages in chat
 * Based on bot functionality from Kid A and Expecto Botronum
 * @author Annika
 */

export interface RepeatedPhrase {
	phrase: string;
	/** interval in milliseconds */
	interval: number;
}

/** roomid:phrase:timeout map */
export const repeats = new Map<RoomID, Map<string, NodeJS.Timeout | null>>();

export function hasRepeat(room: BasicRoom, phrase: string) {
	return !!repeats.get(room.roomid)?.get(phrase);
}

export function addRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
	if (!room.settings.repeats) room.settings.repeats = [];
	room.settings.repeats.push(repeat);
	room.saveSettings();
	runRepeat(room, repeat);
}

export function removeRepeat(room: BasicRoom, phrase: string) {
	if (!room.settings.repeats) return false;
	room.settings.repeats = room.settings.repeats.filter(repeat => repeat.phrase !== phrase);
	room.saveSettings();

	if (!repeats.has(room.roomid)) return;

	const oldInterval = repeats.get(room.roomid)?.get(phrase);
	if (oldInterval) clearInterval(oldInterval);
	repeats.get(room.roomid)?.set(phrase, null);
}

function runRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
	if (!repeats.has(room.roomid)) {
		repeats.set(room.roomid, new Map<string, NodeJS.Timeout | null>());
	}

	const displayRepeat = (targetRoom: BasicRoom, phrase: string) => {
		targetRoom.add(`|html|<div class="infobox">${phrase}</div>`);
		targetRoom.update();
	};

	repeats.get(room.roomid)?.set(
		repeat.phrase,
		setInterval(displayRepeat, repeat.interval, room, repeat.phrase)
	);
}

function loadRepeats() {
	for (const room of Rooms.rooms.values()) {
		if (!room.settings?.repeats?.length) continue;
		for (const repeat of room.settings.repeats) {
			runRepeat(room, repeat);
		}
	}
}

export const pages: PageTable = {
	repeats(args, user) {
		const room = this.requireRoom();
		this.title = `Repeated phrases in ${room.roomid}`;
		this.checkCan("mute", null, room);
		if (!room.settings.repeats) return `<h1>${this.tr`There are no repeated phrases in ${room.roomid}.`}</h1>`;
		let html = `<div class="ladder pad"><h1>${this.tr`Repeated phrases in ${room.roomid}`}</h1>`;
		html += `<table><tr><th>${this.tr`Phrase`}</th><th>${this.tr`Interval`}</th><th>${this.tr`Action`}</th>`;
		html += `<button class="button" name="send" value="/join view-repeats-${room.roomid}" style="float: right">`;
		html += `<i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button>`;
		for (const repeat of room.settings.repeats) {
			const minutes = repeat.interval / (60 * 1000);
			html += `<tr><td>${repeat.phrase}</td><td>${this.tr`every ${minutes} minute(s)`}</td>`;
			html += `<td><button class="button" name="send" value="/removerepeat ${repeat.phrase}">${this.tr`Remove`}</button></td>`;
		}
		html += `</table></div>`;
		return html;
	},
};

export const commands: ChatCommands = {
	repeat(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const [intervalString, message] = this.splitOne(target);
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1) {
			return this.errorReply(this.tr`You must specify a numerical interval of at least 1 minute.`);
		}

		if (hasRepeat(room, message)) {
			return this.errorReply(this.tr`The phrase "${message}" is already being repeated in this room.`);
		}

		addRepeat(room, {
			phrase: Chat.formatText(message).replace(/\n/g, `<br />`),
			interval: interval * 60 * 1000, // convert to milliseconds
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} minute${Chat.plural(interval)}: "${message}"`);
		this.privateModAction(
			room.tr`${user.name} set the phrase "${message}" to be repeated every ${interval} minute(s).`
		);
	},
	repeathelp() {
		this.runBroadcast();
		this.sendReplyBox(
			`<code>/repeat [minutes], [phrase]</code>: repeats a given phrase every [minutes] minutes.<br />` +
			`<code>/removerepeat [phrase]</code>: removes a repeated phrase.<br />` +
			`/viewrepeats [optional room] - Displays all repeated phrases in a room.<br />` +
			`Phrases for <code>/repeat</code> can include normal chat formatting, but not commands. Requires: % @ # &`
		);
	},

	deleterepeat: 'removerepeat',
	removerepeat(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);

		if (!target) return this.parse('/help repeat');
		target = target.trim();

		if (!hasRepeat(room, target)) {
			return this.errorReply(this.tr`The phrase "${target}" is not being repeated in this room.`);
		}

		removeRepeat(room, target);

		this.modlog('REMOVE REPEATPHRASE', null, `"${target}"`);
		this.privateModAction(room.tr`${user.name} removed the repeated phrase "${target}".`);
	},

	removeallrepeats(target, room, user) {
		room = this.requireRoom();
		this.checkCan('declare', null, room);
		if (!room.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		for (const repeat of room.settings.repeats) {
			removeRepeat(room, repeat.phrase);
		}

		this.modlog('REMOVE REPEATPHRASE', null, 'all repeated phrases');
		this.privateModAction(room.tr`${user.name} removed all repeated phrases.`);
	},

	repeats: 'viewrepeats',
	viewrepeats(target, room, user) {
		const roomid = toID(target) || room?.roomid;
		if (!roomid) return this.errorReply(this.tr`You must specify a room when using this command in PMs.`);
		this.parse(`/j view-repeats-${roomid}`);
	},
};

loadRepeats();

process.nextTick(() => {
	Chat.multiLinePattern.register('/repeat ');
});
